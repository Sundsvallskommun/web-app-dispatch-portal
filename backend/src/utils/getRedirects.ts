import { Request } from 'express';
import { isValidUrl } from './isValidUrl';
import { isValidOrigin } from './isValidOrigin';
import { SAML_SUCCESS_REDIRECT } from '@/config';
import { RelayState } from '@/interfaces/relaystate.interface';

export const getRedirects = async (
  req: Request,
  fallBackUrl: string = SAML_SUCCESS_REDIRECT ?? '/',
): Promise<{ successRedirect: URL; failureRedirect: URL; host?: string }> => {
  let successRedirect: URL, failureRedirect: URL, host: string | undefined;

  const relayStateValue =
    typeof req.body?.RelayState === 'string'
      ? req.body.RelayState
      : typeof req.query?.RelayState === 'string'
        ? req.query.RelayState
        : undefined;

  const relayState: RelayState | undefined = relayStateValue ? JSON.parse(relayStateValue) : undefined;

  if (isValidUrl(relayState?.successRedirect) && (await isValidOrigin(relayState.successRedirect))) {
    successRedirect = new URL(relayState.successRedirect);
  } else {
    successRedirect = new URL(fallBackUrl);
  }

  if (isValidUrl(relayState?.failureRedirect) && (await isValidOrigin(relayState?.failureRedirect))) {
    failureRedirect = new URL(relayState?.failureRedirect);
  } else {
    failureRedirect = successRedirect;
  }

  if (relayState?.host) {
    host = relayState.host;
  }

  return { successRedirect, failureRedirect, host };
};
