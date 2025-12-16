import { PrecheckRecipient, Recipient } from '@/data-contracts/postportalservice/data-contracts';

export interface ExtendedRecipient extends Recipient {
  reason?: PrecheckRecipient['reason'];
  personNumber?: string;
}

export enum CSVStatus {
  Ok = 'OK',
  Bad = 'BAD',
}
export interface CSV {
  name: string;
  file: Express.Multer.File;
  status: CSVStatus;
  id: string;
}
