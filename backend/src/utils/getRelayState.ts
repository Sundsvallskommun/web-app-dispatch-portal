import { SAML_SUCCESS_REDIRECT } from '@/config';
import { RelayState } from '@/interfaces/relaystate.interface';
import { Request } from 'express';
import { getRequestHost } from './getHostData';

export const getRelayState = (req: Request): string => {
  let successRedirect = SAML_SUCCESS_REDIRECT ?? '/';

  if (req?.session?.returnTo) {
    successRedirect = req.session.returnTo;
  }
  if (typeof req?.query?.successRedirect === 'string') {
    successRedirect = req.query.successRedirect;
  }

  let failureRedirect = successRedirect;

  if (typeof req?.query?.failureRedirect === 'string') {
    failureRedirect = req.query.failureRedirect;
  }

  const host = typeof req?.query?.host === 'string' ? req.query.host : getRequestHost(req);

  const relayState: RelayState = { successRedirect, failureRedirect, host };

  return JSON.stringify(relayState);
};
