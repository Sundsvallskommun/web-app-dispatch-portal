import { Request } from 'express';
import { isValidUrl } from './isValidUrl';
import { isValidOrigin } from './isValidOrigin';
import { SAML_SUCCESS_REDIRECT } from '@/config';
import { RelayState } from '@/interfaces/relaystate.interface';

export const getRedirects = (req: Request): { successRedirect: URL; failureRedirect: URL; host: string } => {
  let successRedirect: URL, failureRedirect: URL, host: string;

  const relayState: RelayState = typeof req.body?.RelayState === 'string' ? JSON.parse(req.body.RelayState) : undefined;

  if (isValidUrl(relayState?.successRedirect) && isValidOrigin(relayState?.successRedirect)) {
    successRedirect = new URL(relayState.successRedirect);
  } else {
    successRedirect = new URL(SAML_SUCCESS_REDIRECT ?? '/');
  }

  if (isValidUrl(relayState?.failureRedirect) && isValidOrigin(relayState?.failureRedirect)) {
    failureRedirect = new URL(relayState?.failureRedirect);
  } else {
    failureRedirect = successRedirect;
  }
  if (relayState?.host) {
    host = relayState.host;
  }
  return { successRedirect, failureRedirect, host };
};
