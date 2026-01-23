import { getPermissions } from '@/services/authorization.service';
import {
  BASE_URL_PREFIX,
  CREDENTIALS,
  DEV,
  LOG_FORMAT,
  MUNICIPALITY_ID,
  NODE_ENV,
  PORT,
  SAML_CALLBACK_URL,
  SAML_ENTRY_SSO,
  SAML_FAILURE_REDIRECT,
  SAML_IDP_PUBLIC_CERT,
  SAML_ISSUER,
  SAML_LOGOUT_CALLBACK_URL,
  SAML_LOGOUT_REDIRECT,
  SAML_PRIVATE_KEY,
  SAML_PUBLIC_KEY,
  SECRET_KEY,
  SESSION_MEMORY,
  SWAGGER_ENABLED,
  TEST_EMAIL,
  TEST_USERNAME,
} from '@config';
import errorMiddleware from '@middlewares/error.middleware';
import { Strategy, VerifiedCallback } from '@node-saml/passport-saml';
import { logger, stream } from '@utils/logger';
import bodyParser from 'body-parser';
import { defaultMetadataStorage } from 'class-transformer/cjs/storage';
import { validationMetadatasToSchemas } from 'class-validator-jsonschema';
import compression from 'compression';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import express from 'express';
import rateLimit from 'express-rate-limit';
import session from 'express-session';
import { existsSync, mkdirSync } from 'fs';
import helmet from 'helmet';
import hpp from 'hpp';
import createMemoryStore from 'memorystore';
import morgan from 'morgan';
import passport from 'passport';
import { join } from 'path';
import 'reflect-metadata';
import { getMetadataArgsStorage, useExpressServer } from 'routing-controllers';
import { routingControllersToSpec } from 'routing-controllers-openapi';
import createFileStore from 'session-file-store';
import swaggerUi from 'swagger-ui-express';
import { HttpException } from './exceptions/HttpException';
import { Profile } from './interfaces/profile.interface';
import { User } from './interfaces/users.interface';
import ApiService from './services/api.service';
import { getRedirects } from './utils/getRedirects';
import { getRelayState } from './utils/getRelayState';
import { dataDir, dataPath } from './utils/util';
import { isAllowedOrigin } from './utils/isAllowedOrigin';

const apiService = new ApiService();
const SessionStoreCreate = SESSION_MEMORY ? createMemoryStore(session) : createFileStore(session);
const sessionTTL = 4 * 24 * 60 * 60;
// NOTE: memory uses ms while file uses seconds
const sessionStore = new SessionStoreCreate(
  SESSION_MEMORY ? { checkPeriod: sessionTTL * 1000 } : { ttl: sessionTTL, path: './data/sessions' },
);

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

const samlStrategy = new Strategy(
  {
    disableRequestedAuthnContext: true,
    //attributeConsumingServiceIndex: '2',
    //xmlSignatureTransforms: ['test'],
    //authnContext: ['urn:oasis:names:tc:SAML:2.0:ac:classes:unspecified'],
    // identifierFormat: 'urn:oasis:names:tc:SAML:2.0:nameid-format:transient',
    identifierFormat: 'urn:oasis:names:tc:SAML:1.1:nameid-format:unspecified',
    callbackUrl: SAML_CALLBACK_URL,
    entryPoint: SAML_ENTRY_SSO,
    //decryptionPvk: SAML_PRIVATE_KEY,
    privateKey: SAML_PRIVATE_KEY,
    // Identity Provider's public key
    idpCert: SAML_IDP_PUBLIC_CERT,
    issuer: SAML_ISSUER,
    wantAssertionsSigned: false,
    signatureAlgorithm: 'sha256',
    digestAlgorithm: 'sha256',
    // maxAssertionAgeMs: 2592000000,
    // authnRequestBinding: 'HTTP-POST',
    //logoutUrl: 'http://194.71.24.30/sso',
    logoutCallbackUrl: SAML_LOGOUT_CALLBACK_URL,
    acceptedClockSkewMs: -1,
    wantAuthnResponseSigned: false,
    audience: false,
  },
  async function (profile: Profile, done: VerifiedCallback) {
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
    const groups = profile['http://schemas.xmlsoap.org/claims/Group']?.join(',') ?? profile['groups'];
    const username = profile['urn:oid:0.9.2342.19200300.100.1.1'];

    if (!givenName || !sn || !email || !username) {
      return done(null, null, {
        name: 'SAML_MISSING_ATTRIBUTES',
        message: 'Missing profile attributes',
      });
    }

    const groupList: string[] = groups !== undefined ? (groups.split(',').map(x => x.toLowerCase()) as string[]) : [];

    const appGroups: string[] = groupList.length > 0 ? groupList : [];

    try {
      let employee = username;
      if (DEV) {
        employee = TEST_USERNAME;
      }
      const dummyUser: User = {
        id: 0,
        personId: '',
        name: '',
        givenName: '',
        surname: '',
        email: '',
        password: '',
        username: '',
        groups: '',
        permissions: {
          canSendSMS: false,
          canSendLetter: true,
          canSendRegisteredLetter: false,
        },
      };

      const employeeDetails = await apiService.get<any>(
        { url: `employee/2.0/${MUNICIPALITY_ID}/portalpersondata/PERSONAL/${employee}` },
        dummyUser,
      );
      const { personid, orgTree } = employeeDetails.data;

      // Get permissions of the user
      const permissionsUser: User = { ...dummyUser };
      permissionsUser.username = DEV ? TEST_USERNAME : username;
      const permissions = await getPermissions(permissionsUser, apiService);

      const findUser = {
        name: `${givenName} ${sn}`,
        givenName: givenName,
        surname: sn,
        username: DEV ? TEST_USERNAME : username,
        email: DEV ? TEST_EMAIL : email,
        personId: personid,
        orgTree,
        groups: appGroups,
        permissions,
      };

      logger.info('Found user:', findUser);

      done(null, findUser);
    } catch (err) {
      if (err instanceof HttpException && err?.status === 404) {
        logger.error('Error when getting user:');
        logger.error(err);
      }
      done(err);
    }
  },
  async function (_profile: Profile, done: VerifiedCallback) {
    return done(null, {});
  },
);

class App {
  public app: express.Application;
  public env: string;
  public port: string | number;
  public swaggerEnabled: boolean;

  constructor(Controllers: Function[]) {
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

    this.app.use(`${BASE_URL_PREFIX}${dataPath()}`, express.static(dataDir('uploads')));

    this.app.use(
      session({
        secret: SECRET_KEY,
        resave: false,
        saveUninitialized: false,
        store: sessionStore,
      }),
    );

    this.app.use(passport.initialize() as any);
    this.app.use(passport.session());
    passport.use('saml', samlStrategy);

    this.app.use(
      cors({
        credentials: CREDENTIALS,
        origin: function (origin, callback) {
          if (isAllowedOrigin(origin) || NODE_ENV == 'development') {
            callback(null, true);
          } else {
            callback(new Error('Not allowed by CORS'));
          }
        },
      }),
    );

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

    this.app.get(`${BASE_URL_PREFIX}/saml/metadata`, (req, res) => {
      res.type('application/xml');
      const metadata = samlStrategy.generateServiceProviderMetadata(SAML_PUBLIC_KEY, SAML_PUBLIC_KEY);
      res.status(200).send(metadata);
    });

    this.app.get(
      `${BASE_URL_PREFIX}/saml/logout`,
      bodyParser.urlencoded({ extended: false }),
      (req, res, next) => {
        req.url = `${req.path}?RelayState=${getRelayState(req)}`;
        next();
      },
      (req, res, next) => {
        samlStrategy.logout(req as any, () => {
          req.logout(err => {
            if (err) {
              return next(err);
            }
            // FIXME: should we redirect here or should client do it?
            res.redirect(SAML_LOGOUT_REDIRECT);
          });
        });
      },
    );

    this.app.get(
      `${BASE_URL_PREFIX}/saml/logout/callback`,
      bodyParser.urlencoded({ extended: false }),
      (req, res, next) => {
        req.logout(err => {
          if (err) {
            return next(err);
          }

          const { successRedirect, failureRedirect } = getRedirects(req);

          const queries = new URLSearchParams(failureRedirect.searchParams);

          if (req.session.messages?.length > 0) {
            queries.append('failMessage', req.session.messages[0]);
          } else {
            queries.append('failMessage', 'SAML_UNKNOWN_ERROR');
          }

          if (failureRedirect) {
            res.redirect(failureRedirect.toString());
          } else {
            res.redirect(successRedirect.toString());
          }
        });
      },
    );

    this.app.post(
      `${BASE_URL_PREFIX}/saml/login/callback`,
      bodyParser.urlencoded({ extended: false }),
      samlLoginRateLimiter,
      (req, res, next) => {
        const { successRedirect, failureRedirect } = getRedirects(req);

        const redirectWithFailure = (message: string) => {
          const params = new URLSearchParams(failureRedirect.searchParams);
          params.append('failMessage', message || 'SAML_UNKNOWN_ERROR');
          failureRedirect.search = params.toString();
          return res.redirect(failureRedirect.toString());
        };

        const handleLogin = (err, user) => {
          if (err) return redirectWithFailure(err.name);

          if (!user) return redirectWithFailure('NO_USER');

          req.login(user, loginErr => {
            if (loginErr) return redirectWithFailure('SAML_UNKNOWN_ERROR');
            return res.redirect(successRedirect.toString());
          });
        };

        passport.authenticate('saml', handleLogin)(req, res, next);
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
    const databaseDir: string = join(__dirname, '../data/database');
    if (!existsSync(databaseDir)) {
      mkdirSync(databaseDir, { recursive: true });
    }
    const logsDir: string = join(__dirname, '../data/logs');
    if (!existsSync(logsDir)) {
      mkdirSync(logsDir, { recursive: true });
    }
    const sessionsDir: string = join(__dirname, '../data/sessions');
    if (!existsSync(sessionsDir)) {
      mkdirSync(sessionsDir, { recursive: true });
    }
  }
}

export default App;
