import { CSV } from '@/interfaces/recipient.interface';
import { User } from '@/interfaces/users.interface';
import { Organization } from '@prisma/client';
import 'express-session';

declare module 'express-session' {
  interface Session {
    returnTo?: string;
    user?: User;
    origin?: string;
    municipalityId: number;
    organization: Organization;
    passport?: any;
    messages: string[];
    csv: CSV;
  }
}
