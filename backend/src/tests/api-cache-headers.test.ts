// API-svar ska aldrig lagras i webbläsarcachen.
//
// Regression: alla värdnamn i multi-tenant-uppsättningen delar samma API-origin. Ett svar som
// cachats vid ett same-origin-anrop saknar `Access-Control-Allow-Origin`, eftersom ingen
// `Origin`-header skickades. Återanvändes den cacheposten vid ett senare cross-origin-anrop från
// ett tenant-värdnamn blockerade webbläsaren svaret med "No 'Access-Control-Allow-Origin' header
// is present" - trots att servern svarade korrekt när svaret faktiskt genererades.
//
// `Cache-Control: no-store` gör att svaret inte lagras, vilket tar bort både 304-svaren och
// möjligheten att återanvända ett svar över origin-gränsen.

import App from '@/app';
import { BASE_URL_PREFIX } from '@/config';
import { CONTROLLERS } from '@/controllers';
import session from 'express-session';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import { collectRegisteredRoutes, toConcretePath } from './helpers/routes';
import { startServer, TestServer } from './helpers/server';

vi.mock('@/services/api.service', async importOriginal =>
  (await import('./helpers/module-mocks.js')).apiServiceMock(importOriginal),
);

vi.mock('@/utils/prisma', async () => (await import('./helpers/module-mocks.js')).prismaMock());

describe('API cache headers', () => {
  let server: TestServer;

  beforeAll(async () => {
    server = await startServer(new App([...CONTROLLERS], new session.MemoryStore()).getServer());
  });

  afterAll(() => server.close());

  const routes = collectRegisteredRoutes();

  it('enumerates the routes it is about to probe', () => {
    expect(routes.length).toBeGreaterThan(0);
  });

  it.each(routes.map(route => [`${route.httpMethod.toUpperCase()} ${route.path}`, route] as const))(
    'sends no-store on %s',
    async (_label, route) => {
      const response = await server.request(route.httpMethod, `${BASE_URL_PREFIX}${toConcretePath(route.path)}`);

      expect(response.headers.get('cache-control')).toBe('no-store');
    },
  );

  it('sends no-store on the SAML login redirect', async () => {
    const response = await server.request('get', `${BASE_URL_PREFIX}/saml/login`);

    expect(response.headers.get('cache-control')).toBe('no-store');
  });

  it('does not send an ETag that could trigger a conditional request', async () => {
    const response = await server.request('get', `${BASE_URL_PREFIX}/health/up`);

    expect(response.status).not.toBe(404);
    expect(response.headers.get('cache-control')).toBe('no-store');
  });
});
