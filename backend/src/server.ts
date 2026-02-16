import App from '@/app';
import { IndexController } from '@controllers/index.controller';
import validateEnv from '@utils/validateEnv';
import { UserController } from './controllers/user.controller';
import { HealthController } from './controllers/health.controller';
import { RecipientController } from './controllers/recipient.controller';
import { MessageController } from './controllers/message.controller';
import { DepartmentsController } from './controllers/departments.controller';
import { StatisticsController } from '@controllers/statistics.controller';
import { AdminUserController } from './controllers/admin/user.controller';
import { AdminHostController } from './controllers/admin/host.controller';
import { AdminIdpController } from './controllers/admin/idp.controller';
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

  const app = new App(
    [
      IndexController,
      UserController,
      HealthController,
      RecipientController,
      MessageController,
      DepartmentsController,
      StatisticsController,
      AdminHostController,
      AdminIdpController,
      AdminUserController,
    ],
    sessionStore,
  );

  app.listen();
}

bootstrap().catch(err => {
  console.error('Failed to start app: ', err);
  process.exit(1);
});
