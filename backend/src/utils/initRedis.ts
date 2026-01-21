import { createClient, RedisClientType } from 'redis';
import { SESSION_STORE, REDIS_HOST, REDIS_PORT, REDIS_PASSWORD } from '@config';
import { logger } from '@utils/logger';

let client: RedisClientType | null = null;

export async function initRedis(): Promise<void> {
  if (SESSION_STORE !== 'redis') {
    return;
  }

  if (!REDIS_HOST) {
    throw new Error('SESSION_STORE=redis but REDIS_HOST is not set');
  }

  if (client) {
    return;
  }

  client = createClient({
    socket: {
      host: REDIS_HOST,
      port: Number(REDIS_PORT || 6379),
    },
    password: REDIS_PASSWORD,
  });

  try {
    await client.connect();
    logger.info('Redis connected');
  } catch (err) {
    logger.error('Failed to connect to Redis', err);
    client = null;
    throw err;
  }
}

export function getRedisClient(): RedisClientType {
  if (!client) {
    throw new Error('Redis client not initialized. Call initRedis() first.');
  }
  return client;
}
