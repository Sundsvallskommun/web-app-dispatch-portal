import { SAML_SUCCESS_REDIRECT } from '@/config';
import { Request } from 'express';
import { getOrigin } from './getOrigin';

/**
 * @param req
 * @returns "successRedirect,failureRedirect,host"
 */
export const getRelayState = (req: Request): string => {
  const successRedirect = req?.query?.successRedirect ?? req?.session?.returnTo ?? SAML_SUCCESS_REDIRECT ?? '/';

  const origin = getOrigin(req);
  const relayState = `${successRedirect},${req?.query?.failureRedirect ?? successRedirect},${origin}`;

  return relayState;
};
