import { Request } from 'express';
import { isValidUrl } from './isValidUrl';
import { isValidOrigin } from './isValidOrigin';
import { SAML_SUCCESS_REDIRECT } from '@/config';

export const getRedirects = (req: Request): { successRedirect: URL; failureRedirect: URL } => {
  let successRedirect: URL, failureRedirect: URL;
  const urls = req?.body?.RelayState.split(',');

  if (isValidUrl(urls?.[0]) && isValidOrigin(urls?.[0])) {
    successRedirect = new URL(urls[0]);
  } else {
    successRedirect = new URL(SAML_SUCCESS_REDIRECT ?? '/');
  }

  if (isValidUrl(urls?.[1]) && isValidOrigin(urls?.[1])) {
    failureRedirect = new URL(urls[1]);
  } else {
    failureRedirect = successRedirect;
  }
  return { successRedirect, failureRedirect };
};
