import { createClient, RedisClientType } from 'redis';
import { SESSION_STORE, REDIS_HOST, REDIS_PORT, REDIS_PASSWORD } from '@config';
import { logger } from '@utils/logger';

export let redisClient: RedisClientType | null = null;

export async function initRedis() {
  if (SESSION_STORE !== 'redis') return null;

  if (!REDIS_HOST) {
    throw new Error('SESSION_STORE=redis but REDIS_HOST is not set');
  }

  redisClient = createClient({
    socket: {
      host: REDIS_HOST,
      port: Number(REDIS_PORT || 6379),
    },
    password: REDIS_PASSWORD,
  });

  try {
    await redisClient.connect();
    logger.info('Redis connected');
    return redisClient;
  } catch (err) {
    logger.error('Failed to connect to Redis', err);
    throw err;
  }
}
