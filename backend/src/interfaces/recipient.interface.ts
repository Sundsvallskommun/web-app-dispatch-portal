import { PrecheckRecipient, Recipient } from '@/data-contracts/postportalservice/data-contracts';

export interface ExtendedRecipient extends Recipient {
  reason?: PrecheckRecipient['reason'];
  personNumber?: string;
}

export enum CSVStatus {
  Ok = 'OK',
  Bad = 'BAD',
}

export enum CSVError {
  Unknown = 'UNKNOWN',
  MissingValidIds = 'MISSING_VALID_IDS',
}
export interface CSV {
  name: string;
  file: Express.Multer.File;
  status: CSVStatus;
  id: string;
}
