// Source-level guard for the default-deny auth model.
//
// Walks every route routing-controllers has registered and asserts that every route
// without authMiddleware carries @Public(). This catches a new unauthenticated route
// at the point it is added, without booting the app.
//
// This test is about declared intent. The runtime counterpart
// (default-auth.runtime.test.ts) proves the app-level guard actually denies these requests.

import { PUBLIC_PATH_PREFIXES } from '@/config/public-paths';
import { CONTROLLERS } from '@/controllers';
import { collectRegisteredRoutes } from './helpers/routes';

describe('default-deny auth (metadata)', () => {
  const routes = collectRegisteredRoutes();

  it('registers routes for every mounted controller', () => {
    expect(routes.length).toBeGreaterThan(0);

    const controllersWithRoutes = new Set(routes.map(route => route.controllerName));
    expect(controllersWithRoutes.size).toBe(CONTROLLERS.length);
  });

  it('has no route that is both unauthenticated and not marked @Public()', () => {
    const unguarded = routes
      .filter(route => !route.hasAuthMiddleware && !route.isPublic)
      .map(route => `${route.httpMethod.toUpperCase()} ${route.path} (${route.controllerName}.${route.handlerName})`);

    expect(unguarded).toEqual([]);
  });

  it('has no route marked both @Public() and @UseBefore(authMiddleware)', () => {
    const contradictory = routes
      .filter(route => route.isPublic && route.hasAuthMiddleware)
      .map(route => `${route.httpMethod.toUpperCase()} ${route.path}`);

    expect(contradictory).toEqual([]);
  });

  // Unlike @Public(), a prefix opens a whole subtree for every method, and it does so for
  // paths this suite never walks - anything mounted on Express directly rather than through
  // a controller. Neither the route list above nor the runtime suite would notice an entry
  // added here, so pinning it is the only thing that puts it in front of a reviewer.
  it('pins the non-controller public path prefixes', () => {
    expect([...PUBLIC_PATH_PREFIXES]).toEqual(['/api-docs', '/swagger.json']);
  });

  it('pins the set of public routes with their stated reasons', () => {
    const publicSurface = routes
      .filter(route => route.isPublic)
      .map(route => `${route.httpMethod.toUpperCase()} ${route.path} // ${route.publicReason ?? 'no reason given'}`)
      .sort();

    expect(publicSurface).toEqual([
      'GET / // Service root - returns a constant, no user context',
      'GET /health/up // Liveness probe - polled by infrastructure without a session',
    ]);
  });
});
