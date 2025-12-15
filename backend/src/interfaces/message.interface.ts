import { Address, Recipient } from '@/data-contracts/postportalservice/data-contracts';
import { ApiResponse } from '@/services/api.service';

export interface MessageResponseData {
  recipients?: Recipient[];
  addresses?: Address[];
  recipientPersonId?: string;
  csv?: boolean;
}

export type MessageResponse = ApiResponse<MessageResponseData>;
