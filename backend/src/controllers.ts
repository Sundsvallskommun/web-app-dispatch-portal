import { AdminHostController } from './controllers/admin/host.controller';
import { AdminIdpController } from './controllers/admin/idp.controller';
import { AdminMessagingSettingsController } from './controllers/admin/messaging-settings.controller';
import { AdminUserController } from './controllers/admin/user.controller';
import { DepartmentsController } from './controllers/departments.controller';
import { HealthController } from './controllers/health.controller';
import { IndexController } from './controllers/index.controller';
import { MessageController } from './controllers/message.controller';
import { MessagingSettingsController } from './controllers/messaging-settings.controller';
import { RecipientController } from './controllers/recipient.controller';
import { StatisticsController } from './controllers/statistics.controller';
import { UserController } from './controllers/user.controller';

export const CONTROLLERS = [
  IndexController,
  UserController,
  HealthController,
  RecipientController,
  MessageController,
  DepartmentsController,
  StatisticsController,
  MessagingSettingsController,
  AdminHostController,
  AdminIdpController,
  AdminUserController,
  AdminMessagingSettingsController,
];
