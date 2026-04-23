import { Request } from 'express';
import {
  SAML_CALLBACK_URL,
  SAML_ENTRY_SSO,
  SAML_IDP_PUBLIC_CERT,
  SAML_ISSUER,
  SAML_LOGOUT_CALLBACK_URL,
  SAML_PRIVATE_KEY,
} from '@/config';
import { getHostData, isAdminRequest, normalizeCertificate } from './getHostData';
import { logger } from './logger';

export const baseSamlConfig = {
  passReqToCallback: true,
  disableRequestedAuthnContext: true,
  identifierFormat: 'urn:oasis:names:tc:SAML:1.1:nameid-format:unspecified',
  callbackUrl: SAML_CALLBACK_URL,
  privateKey: SAML_PRIVATE_KEY,
  issuer: SAML_ISSUER,
  wantAssertionsSigned: false,
  wantAuthnResponseSigned: false,
  audience: false as const,
  logoutCallbackUrl: SAML_LOGOUT_CALLBACK_URL,
  acceptedClockSkewMs: -1,
};

export const getSamlOptionsForRequest = async (req: Request) => {
  if (await isAdminRequest(req)) {
    logger.info('[SAML] admin branch');
    return {
      ...baseSamlConfig,
      entryPoint: SAML_ENTRY_SSO,
      idpCert: normalizeCertificate(SAML_IDP_PUBLIC_CERT) ?? SAML_IDP_PUBLIC_CERT,
    };
  }

  const hostData = await getHostData(req);
  const idpConfig = hostData?.idp;

  if (idpConfig?.entryPoint && idpConfig?.idpCert) {
    logger.info(`[SAML] db branch host=${hostData?.name} idpId=${hostData?.idpId}`);
    return {
      ...baseSamlConfig,
      entryPoint: idpConfig.entryPoint,
      idpCert: idpConfig.idpCert,
    };
  }

  logger.info('[SAML] fallback branch');

  return {
    ...baseSamlConfig,
    entryPoint: SAML_ENTRY_SSO,
    idpCert: normalizeCertificate(SAML_IDP_PUBLIC_CERT) ?? SAML_IDP_PUBLIC_CERT,
  };
};
