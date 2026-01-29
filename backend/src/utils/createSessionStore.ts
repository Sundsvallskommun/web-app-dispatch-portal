import session from 'express-session';
import createMemoryStore from 'memorystore';
import createFileStore from 'session-file-store';
import { RedisStore } from 'connect-redis';
import { SESSION_STORE } from '@config';
import { getRedisClient } from './initRedis';

export function createSessionStore(sessionTTL: number): session.Store {
  if (SESSION_STORE === 'redis') {
    const client = getRedisClient();
    if (!client) {
      throw new Error('Redis client not initialized');
    }

    return new RedisStore({
      client,
      ttl: sessionTTL,
    });
  }

  if (SESSION_STORE === 'memory') {
    const MemoryStore = createMemoryStore(session);
    return new MemoryStore({
      checkPeriod: sessionTTL * 1000,
    });
  }

  const FileStore = createFileStore(session);
  return new FileStore({
    path: './data/sessions',
    ttl: sessionTTL,
  });
}
