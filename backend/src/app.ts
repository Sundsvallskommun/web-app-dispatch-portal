import { getPermissions, getRoles } from '@/services/authorization.service';
import {
  BASE_URL_PREFIX,
  DEV,
  ENABLE_LOCAL_STORAGE,
  getApiBase,
  LOG_FORMAT,
  NODE_ENV,
  PORT,
  SAML_FAILURE_REDIRECT,
  SAML_LOGOUT_REDIRECT,
  SAML_PUBLIC_KEY,
  SECRET_KEY,
  SWAGGER_ENABLED,
  TEST_EMAIL,
  TEST_USERNAME,
} from '@config';
import errorMiddleware from '@middlewares/error.middleware';
import { MultiSamlStrategy, VerifiedCallback } from '@node-saml/passport-saml';
import { logger, stream } from '@utils/logger';
import bodyParser from 'body-parser';
import { defaultMetadataStorage } from 'class-transformer/cjs/storage';
import { validationMetadatasToSchemas } from 'class-validator-jsonschema';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express, { Request } from 'express';
import rateLimit from 'express-rate-limit';
import session from 'express-session';
import { existsSync, mkdirSync } from 'fs';
import helmet from 'helmet';
import hpp from 'hpp';
import morgan from 'morgan';
import passport from 'passport';
import { join } from 'path';
import 'reflect-metadata';
import { getMetadataArgsStorage, useExpressServer } from 'routing-controllers';
import { routingControllersToSpec } from 'routing-controllers-openapi';
import swaggerUi from 'swagger-ui-express';
import { HttpException } from './exceptions/HttpException';
import { RequestWithUser } from './interfaces/auth.interface';
import { Profile } from './interfaces/profile.interface';
import { User } from './interfaces/users.interface';
import ApiService from './services/api.service';
import { getRedirects } from './utils/getRedirects';
import { getRelayState } from './utils/getRelayState';
import { getRequestHost, resolveRequestHost } from './utils/getHostData';
import { baseSamlConfig, getSamlOptionsForRequest } from './utils/getSamlOptions';
import { getMunicipalityInfo } from './utils/getMunicipalityId';
import { buildCorsOptions } from './utils/buildCorsOptions';
import { isValidOrigin } from './utils/isValidOrigin';
import { normalizeGroup } from './utils/normalizeGroup';
import { dataDir, dataPath } from './utils/util';

const apiService = new ApiService();

// Rate limiter for sensitive endpoints, e.g., SAML login callback
const samlLoginRateLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10, // limit each IP to 10 requests per windowMs
  message: 'Too many login attempts from this IP, please try again after a minute',
});

passport.serializeUser(function (user, done) {
  done(null, user);
});
passport.deserializeUser(function (user, done) {
  done(null, user);
});

const getProfileGroups = (profile: Profile): string[] => {
  const rawGroups = profile['http://schemas.xmlsoap.org/claims/Group'] ?? profile?.groups;

  if (!rawGroups) return [];

  const normalizedGroups = Array.isArray(rawGroups) ? rawGroups : rawGroups.split(',');

  return normalizedGroups.map(normalizeGroup).filter(Boolean);
};

const samlStrategy = new MultiSamlStrategy(
  {
    ...baseSamlConfig,
    getSamlOptions: (req, done) => {
      getSamlOptionsForRequest(req)
        .then(samlOptions => done(null, samlOptions))
        .catch(error => done(error));
    },
  },
  async function (req: Request, profile: Profile, done: VerifiedCallback) {
    if (!profile) {
      return done({
        name: 'SAML_MISSING_PROFILE',
        message: 'Missing SAML profile',
      });
    }
    // Depending on using Onegate or ADFS for federation the profile data looks a bit different
    // Here we use the null coalescing operator (??) to handle both cases.
    // (A switch from Onegate to ADFS was done on august 6 2023 due to problems in MobilityGuard.)
    //

    const givenName =
      profile['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/givenname'] ?? profile['givenName'];
    const sn = profile['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/surname'] ?? profile['sn'];
    const email = profile['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] ?? profile['email'];
    const username = profile['urn:oid:0.9.2342.19200300.100.1.1'];

    if (!givenName || !sn || !email || !username) {
      return done(null, null, {
        name: 'SAML_MISSING_ATTRIBUTES',
        message: 'Missing profile attributes',
      });
    }

    const appGroups = getProfileGroups(profile);

    try {
      let employee = username;
      if (DEV) {
        employee = TEST_USERNAME;
      }
      const dummyUser: User = {
        personId: '',
        name: '',
        givenName: '',
        surname: '',
        email: '',
        username: username ?? '',
        groups: [],
        permissions: {
          canSendSMS: false,
          canSendLetter: true,
          canSendRegisteredLetter: false,
        },
      };

      const { municipalityId, domain } = await getMunicipalityInfo(req);

      const employeeDetails = await apiService.get<any>(
        { url: `${getApiBase('employee')}/${municipalityId}/portalpersondata/${domain}/${employee}` },
        dummyUser,
      );
      const { personid, orgTree } = employeeDetails.data;

      // Get permissions of the user
      const permissionsUser: User = { ...dummyUser };
      const reqWithUser = { ...req, user: permissionsUser } as RequestWithUser;
      const permissions = await getPermissions(reqWithUser, apiService);

      const findUser = {
        name: `${givenName} ${sn}`,
        givenName: givenName,
        surname: sn,
        username: DEV ? TEST_USERNAME : username,
        email: DEV ? TEST_EMAIL : email,
        personId: personid,
        orgTree,
        groups: appGroups,
        roles: getRoles(appGroups),
        permissions,
      };

      logger.info('Found user:', findUser);
      done(null, findUser);
    } catch (err) {
      if (err instanceof HttpException && err?.status === 404) {
        console.error('Error when getting user:');
        console.error(err);
        logger.error('Error when getting user:');
        logger.error(err);
      }
      done({ ...err, name: 'AUTH_FAILED' });
    }
    // eslint-disable-next-line Strategy does not like its own typing
  } as any,
  async function (_req: Request, _profile: Profile, done: VerifiedCallback) {
    return done(null, {});
  } as any,
);

class App {
  public app: express.Application;
  public env: string;
  public port: string | number;
  public swaggerEnabled: boolean;

  constructor(
    Controllers: Function[],
    private readonly sessionStore: session.Store,
  ) {
    this.app = express();
    this.env = NODE_ENV || 'development';
    this.port = PORT || 3000;
    this.swaggerEnabled = SWAGGER_ENABLED || false;

    this.initializeDataFolders();

    this.initializeMiddlewares();
    this.initializeRoutes(Controllers);
    if (this.swaggerEnabled) {
      this.initializeSwagger(Controllers);
    }
    this.initializeErrorHandling();
  }

  public listen() {
    this.app.listen(this.port, () => {
      logger.info(`=================================`);
      logger.info(`======= ENV: ${this.env} =======`);
      logger.info(`🚀 App listening on the port ${this.port}`);
      logger.info(`=================================`);
    });
  }

  public getServer() {
    return this.app;
  }

  private initializeMiddlewares() {
    this.app.use(morgan(LOG_FORMAT, { stream }));
    this.app.use(hpp());
    this.app.use(helmet());
    this.app.use(compression() as any);
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(cookieParser());
    this.app.use((req, res, next) => {
      cors(buildCorsOptions(req.path))(req, res, next);
    });

    this.app.use(`${BASE_URL_PREFIX}${dataPath()}`, express.static(dataDir('uploads')));

    this.app.set('trust proxy', 1);

    this.app.use(
      session({
        secret: SECRET_KEY,
        resave: false,
        saveUninitialized: false,
        store: this.sessionStore,
      }),
    );

    this.app.use(passport.initialize());
    this.app.use(passport.session());
    passport.use('saml', samlStrategy);

    this.app.use((req, res, next) => {
      if (req.path.startsWith(`${BASE_URL_PREFIX}/saml`)) {
        return next();
      }

      if (!req.isAuthenticated?.() || !req.user) {
        return next();
      }

      const requestHost = getRequestHost(req);
      const sessionHost = req.session.host?.toLowerCase();

      if (!requestHost || !sessionHost || requestHost === sessionHost) {
        return next();
      }

      logger.warn(
        `Rejecting authenticated request because host does not match session host: requestHost=${requestHost}, sessionHost=${sessionHost}, path=${req.path}`,
      );

      req.logout(logoutError => {
        if (logoutError) {
          logger.error('Could not clear mismatched host session', logoutError);
          return next(new HttpException(401, 'AUTH_FAILED'));
        }

        req.session.destroy(destroyError => {
          if (destroyError) {
            logger.error('Could not destroy mismatched host session', destroyError);
          }

          res.clearCookie('connect.sid');
          return next(new HttpException(401, 'SESSION_HOST_MISMATCH'));
        });
      });
    });

    this.app.get(
      `${BASE_URL_PREFIX}/saml/login`,
      (req, _res, next) => {
        req.url = `${req.path}?RelayState=${getRelayState(req)}`;
        next();
      },
      (req, res, next) => {
        passport.authenticate('saml', {
          failureRedirect: SAML_FAILURE_REDIRECT,
        })(req, res, next);
      },
    );

    this.app.get(`${BASE_URL_PREFIX}/saml/metadata`, (req, res, next) => {
      res.type('application/xml');
      samlStrategy.generateServiceProviderMetadata(req, SAML_PUBLIC_KEY, SAML_PUBLIC_KEY, (err, metadata) => {
        if (err) {
          return next(err);
        }

        res.status(200).send(metadata);
      });
    });

    this.app.get(
      `${BASE_URL_PREFIX}/saml/logout`,
      bodyParser.urlencoded({ extended: false }),
      (_req, _res, next) => {
        next();
      },
      (req, res, next) => {
        samlStrategy.logout(req as any, () => {
          req.logout(async err => {
            if (err) {
              return next(err);
            }
            const { successRedirect } = JSON.parse(getRelayState(req));
            const allowed = await isValidOrigin(successRedirect);
            if (allowed) {
              return res.redirect(successRedirect);
            }

            return res.redirect(SAML_LOGOUT_REDIRECT);
          });
        });
      },
    );

    this.app.get(
      `${BASE_URL_PREFIX}/saml/logout/callback`,
      bodyParser.urlencoded({ extended: false }),
      (req, res, next) => {
        req.logout(async err => {
          if (err) {
            return next(err);
          }

          const { successRedirect, failureRedirect } = await getRedirects(req, SAML_LOGOUT_REDIRECT ?? '/');

          const queries = new URLSearchParams(failureRedirect.searchParams);

          if (req.session.messages?.length > 0) {
            queries.append('failMessage', req.session.messages[0]);
          } else {
            queries.append('failMessage', 'SAML_UNKNOWN_ERROR');
          }

          if (failureRedirect) {
            return res.redirect(failureRedirect.toString());
          }

          return res.redirect(successRedirect.toString());
        });
      },
    );

    this.app.post(
      `${BASE_URL_PREFIX}/saml/login/callback`,
      samlLoginRateLimiter,
      bodyParser.urlencoded({ extended: false }),
      async (req, res, next) => {
        const { successRedirect, failureRedirect } = await getRedirects(req);

        const redirectWithFailure = (message: string) => {
          const params = new URLSearchParams(failureRedirect.searchParams);
          params.append('failMessage', message || 'SAML_UNKNOWN_ERROR');
          failureRedirect.search = params.toString();
          return res.redirect(failureRedirect.toString());
        };

        const handleLogin = (err, user) => {
          if (err) {
            logger.error('SAML callback authentication error', err);
            return redirectWithFailure(err?.message || err?.name || 'SAML_UNKNOWN_ERROR');
          }

          if (!user) return redirectWithFailure('NO_USER');

          req.login(user, async loginErr => {
            if (loginErr) {
              logger.error('Error during req.login', loginErr);
              return redirectWithFailure('SAML_UNKNOWN_ERROR');
            }

            try {
              const { municipalityId, domain } = await getMunicipalityInfo(req);
              const sessionHost = await resolveRequestHost(req);

              if (!sessionHost) {
                logger.error('Could not resolve host for login session');
                return redirectWithFailure('INVALID_HOST');
              }

              req.session.municipalityId = municipalityId;
              req.session.domain = domain;
              req.session.host = sessionHost.toLowerCase();
              req.session.user = user;

              req.session.save(err => {
                if (err) {
                  logger.error('Could not save session', err);
                  return redirectWithFailure('SAML_UNKNOWN_ERROR');
                }

                return res.redirect(successRedirect.toString());
              });
            } catch (sessionError) {
              logger.error('Error finalizing login session', sessionError);
              return redirectWithFailure('SAML_UNKNOWN_ERROR');
            }
          });
        };

        passport.authenticate(
          'saml',
          { failureRedirect: failureRedirect.toString(), failureMessage: true },
          handleLogin,
        )(req, res, next);
      },
    );
  }

  private initializeRoutes(controllers: Function[]) {
    useExpressServer(this.app, {
      routePrefix: BASE_URL_PREFIX,
      controllers: controllers,
      defaultErrorHandler: false,
    });
  }

  private initializeSwagger(controllers: Function[]) {
    const schemas = validationMetadatasToSchemas({
      classTransformerMetadataStorage: defaultMetadataStorage,
      refPointerPrefix: '#/components/schemas/',
    });

    const routingControllersOptions = {
      controllers: controllers,
    };

    const storage = getMetadataArgsStorage();
    const spec = routingControllersToSpec(storage, routingControllersOptions, {
      components: {
        schemas: schemas,
        securitySchemes: {
          basicAuth: {
            scheme: 'basic',
            type: 'http',
          },
        },
      },
      info: {
        description: 'Utskicksportal',
        title: 'API',
        version: '1.0.0',
      },
      servers: [
        {
          url: BASE_URL_PREFIX,
        },
      ],
    });

    this.app.use(`${BASE_URL_PREFIX}/swagger.json`, (req: express.Request, res: express.Response) => {
      res.json(spec);
    });

    this.app.use(`${BASE_URL_PREFIX}/api-docs`, swaggerUi.serve, swaggerUi.setup(spec));
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }

  private initializeDataFolders() {
    if (ENABLE_LOCAL_STORAGE === 'true') {
      logger.info(`Database and Session data folders initialized (ENABLE_LOCAL_STORAGE: ${ENABLE_LOCAL_STORAGE})`);
      const databaseDir: string = join(__dirname, '../data/database');
      if (!existsSync(databaseDir)) {
        mkdirSync(databaseDir, { recursive: true });
      }

      const sessionsDir: string = join(__dirname, '../data/sessions');
      if (!existsSync(sessionsDir)) {
        mkdirSync(sessionsDir, { recursive: true });
      }
    }

    const logsDir: string = join(__dirname, '../data/logs');
    if (!existsSync(logsDir)) {
      mkdirSync(logsDir, { recursive: true });
    }
  }
}

export default App;
