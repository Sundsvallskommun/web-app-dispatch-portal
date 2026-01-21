import session from 'express-session';
import createMemoryStore from 'memorystore';
import createFileStore from 'session-file-store';
import connectRedis from 'connect-redis';
import { SESSION_STORE } from '@config';
import { getRedisClient } from './initRedis';

export function createSessionStore(sessionTTL: number): session.Store {
  if (SESSION_STORE === 'redis') {
    const RedisStore = connectRedis(session);
    return new RedisStore({
      client: getRedisClient(),
      ttl: sessionTTL,
    });
  } else if (SESSION_STORE === 'file') {
    const FileStore = createFileStore(session);
    return new FileStore({ path: './data/sessions', ttl: sessionTTL });
  } else {
    const MemoryStore = createMemoryStore(session);
    return new MemoryStore({ checkPeriod: sessionTTL * 1000 });
  }
}
