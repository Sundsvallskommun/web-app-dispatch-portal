import App from '@/app';
import { CONTROLLERS } from '@/controllers';
import validateEnv from '@utils/validateEnv';
import { initRedis } from './utils/initRedis';
import { createSessionStore } from './utils/createSessionStore';

// --- GLOBAL PROCESS DEBUG HANDLERS ---
process.on('exit', code => {
  console.log(`[PROCESS EXIT] code=${code}`);
});

process.on('uncaughtException', err => {
  console.error('[UNCAUGHT EXCEPTION]', err.stack || err);
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('[UNHANDLED REJECTION]', reason);
  console.error('Promise:', promise);
});

validateEnv();

async function bootstrap() {
  await initRedis();
  const sessionStore = createSessionStore(4 * 24 * 60 * 60);

  const app = new App(CONTROLLERS, sessionStore);

  app.listen();
}

bootstrap().catch(err => {
  console.error('Failed to start app: ', err);
  process.exit(1);
});
