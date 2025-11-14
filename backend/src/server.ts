import App from '@/app';
import { IndexController } from '@controllers/index.controller';
import validateEnv from '@utils/validateEnv';
import { UserController } from './controllers/user.controller';
import { HealthController } from './controllers/health.controller';
import { RecipientController } from './controllers/recipient.controller';
import { MessageController } from './controllers/message.controller';
import { DepartmentsController } from './controllers/departments.controller';
import { StatisticsController } from '@controllers/statistics.controller';
import { DigitalRegisteredletterController } from './controllers/digitalRegisteredLetter.controller';
import { AdminLogotypeController } from './controllers/admin/logotype.controller';
import { AdminMunicipalityController } from './controllers/admin/municipality.controller';
import { AdminOrganizationController } from './controllers/admin/organization.controller';
import { AdminUserController } from './controllers/admin/user.controller';

validateEnv();

const app = new App([
  IndexController,
  UserController,
  HealthController,
  RecipientController,
  MessageController,
  DepartmentsController,
  StatisticsController,
  DigitalRegisteredletterController,
  AdminLogotypeController,
  AdminMunicipalityController,
  AdminOrganizationController,
  AdminUserController,
]);

app.listen();
