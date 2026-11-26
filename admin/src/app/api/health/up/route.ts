import { apiService } from '@services/api-service';

// Probed by OpenShift on every check, so it must never be served from a build-time cache.
export const dynamic = 'force-dynamic';

const requireAuth = process.env.HEALTH_AUTH === 'true';
const authUsername = process.env.HEALTH_USERNAME;
const authPassword = process.env.HEALTH_PASSWORD;

export async function GET(request: Request) {
  const authorization = request.headers.get('authorization');
  const userAuth64 = Buffer.from(`${authUsername}:${authPassword}`).toString('base64');

  if (requireAuth && authorization !== `Basic ${userAuth64}`) {
    return new Response('NOT_AUTHORIZED', { status: 401 });
  }

  try {
    const health = await apiService.get('health/up').then((res) => res.data);

    return Response.json(health, { status: 200 });
  } catch {
    return Response.json({ status: 'ERROR!' }, { status: 500 });
  }
}
