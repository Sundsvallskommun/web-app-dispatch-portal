import { SAML_SUCCESS_REDIRECT } from '@/config';
import { Request } from 'express';

export const getRelayState = (req: Request): string => {
  let relayState = SAML_SUCCESS_REDIRECT ?? '/';
  if (req.session.returnTo) {
    relayState = req.session.returnTo;
  }
  if (req.query.successRedirect) {
    relayState = `${req.query.successRedirect}`;
  }
  if (req.query.failureRedirect) {
    relayState = `${relayState},${req.query.failureRedirect}`;
  }
  return relayState;
};
