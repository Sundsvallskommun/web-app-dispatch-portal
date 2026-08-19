// routing-controllers / class-validator decorators read metadata via reflect-metadata.
// Import it once for the whole test run so decorated classes can be imported in tests.
import 'reflect-metadata';

// app.ts builds the SAML strategy and reads config at IMPORT time, so the default-deny
// runtime tests cannot import the app without these. The values are dummies - no SAML
// flow is exercised, only the auth guard in front of the routes.
//
// Set here rather than in .env.test.local so the suite is deterministic on a fresh
// checkout. `??=` leaves anything the environment already provides untouched.
process.env.BASE_URL_PREFIX ??= '/api';
// utils/logger.ts resolves its log directory at import time and crashes on undefined.
process.env.LOG_DIR ??= '../logs';
process.env.LOG_FORMAT ??= 'dev';
process.env.SECRET_KEY ??= 'test-secret-key';
process.env.API_BASE_URL ??= 'https://api.test.local';
process.env.SAML_ENTRY_SSO ??= 'https://idp.test.local/sso';
process.env.SAML_CALLBACK_URL ??= 'https://app.test.local/api/saml/login/callback';
process.env.SAML_LOGOUT_CALLBACK_URL ??= 'https://app.test.local/api/saml/logout/callback';
process.env.SAML_SUCCESS_REDIRECT ??= 'https://app.test.local';
process.env.SAML_FAILURE_REDIRECT ??= 'https://app.test.local/login';
process.env.SAML_LOGOUT_REDIRECT ??= 'https://app.test.local/logout';
process.env.SAML_ISSUER ??= 'test-issuer';
// node-saml asserts these are present when the Strategy is constructed. They are never
// used to sign or verify anything in tests, so placeholder values are enough.
process.env.SAML_IDP_PUBLIC_CERT ??= 'test-idp-cert';
process.env.SAML_PRIVATE_KEY ??= 'test-private-key';
process.env.SAML_PUBLIC_KEY ??= 'test-public-key';
process.env.ADMIN_URL ??= 'http://localhost:3002';
process.env.ORIGIN ??= 'http://localhost:3000';
