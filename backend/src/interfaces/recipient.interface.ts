import { PrecheckRecipient, Recipient } from '@/data-contracts/postportalservice/data-contracts';

export interface ExtendedRecipient extends Recipient {
  reason?: PrecheckRecipient['reason'];
  personNumber?: string;
}
