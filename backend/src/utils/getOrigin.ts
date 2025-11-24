import { Request } from 'express';

export const getOrigin = (req: Request) => {
  const url = new URL(req?.headers?.origin ?? req?.headers?.referer ?? `https://${req.hostname}`).origin;
  return url;
};
