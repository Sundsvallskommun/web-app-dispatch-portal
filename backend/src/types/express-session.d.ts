import { CSV } from '@/interfaces/recipient.interface';
import { User } from '@/interfaces/users.interface';
import 'express-session';

declare module 'express-session' {
  interface Session {
    returnTo?: string;
    user?: User;
    passport?: any;
    messages: string[];
    csv: CSV;
  }
}
