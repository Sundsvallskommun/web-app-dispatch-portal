import { Address, ESigningSignatory, Recipient } from '@/data-contracts/postportalservice/data-contracts';
import { ApiResponse } from '@/services/api.service';

export interface MessageResponseData {
  recipients?: Recipient[];
  addresses?: Address[];
  signatories?: ESigningSignatory[];
  recipientPersonId?: string;
  csv?: boolean;
}

export type MessageResponse = ApiResponse<MessageResponseData>;
