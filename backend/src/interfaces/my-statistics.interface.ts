import { Message } from '@/data-contracts/messaging/data-contracts';

interface PagingMetaData {
  page: number;
  limit: number;
  count: number;
  totalRecords: number;
  totalPages: number;
}

export interface UserMessages {
  _meta: PagingMetaData;
  messages: UserMessage[];
}

export interface UserMessage {
  subject?: string;
  body: string;
  sentAt: string;
  attachments: MessageAttachment[];
  recipients: Recipient[];
}

export enum EnumMessageType {
  SNAIL_MAIL = 'SNAIL_MAIL',
  DIGITAL_MAIL = 'DIGITAL_MAIL',
  SMS = 'SMS',
}
export enum EnumMessageStatus {
  SENT = 'SENT',
  NOT_SENT = 'NOT_SENT',
  FAILED = 'FAILED',
}

export interface Recipient {
  name: string;
  partyId?: string;
  mobileNumber?: string;
  streetAddress?: string;
  zipCode?: string;
  city?: string;
  messageType: EnumMessageType;
  status: EnumMessageStatus;
  personnummer?: string;
}

export interface MessageAttachment {
  attachmentId: string;
  contentType: string;
  fileName: string;
}

export interface UserBatches {
  _meta: PagingMetaData;
  batches: Batch[];
}
export interface UserLetters {
  _meta: PagingMetaData;
  messages: Message[];
}

export interface Batch {
  batchId: string;
  messageType: string;
  subject: string;
  sent: string;
  attachmentCount: number;
  recipientCount: number;
  status: Status;
}

export interface Status {
  successful: number;
  unsuccessful: number;
}

export interface UserRecLetters {
  _meta: PagingMetaData;
  letters: RecLetter[];
}

export interface RecLetter {
  id: string;
  subject: string;
  municipalityId: string;
  status: string;
  body: string;
  contentType: string;
  created: string;
  updated: string;
  supportInfo: RecSupportInfo;
  attachments: RecAttachment[];
}

export interface RecAttachment {
  id: string;
  fileName: string;
  contentType: string;
}

export interface RecSupportInfo {
  supportText: string;
  contactInformationUrl: string;
  contactInformationPhoneNumber: string;
  contactInformationEmail: string;
}

export interface SigningInfo {
  status: string;
  signedAt: string;
  contentKey: string;
  orderReference: string;
  ocspResponse?: string;
  user: {
    personalIdentityNumber: string;
    name: string;
    givenName: string;
    surname: string;
  };
  device: {
    ipAddress: string;
  };
  stepUp?: {
    mrtd: boolean;
  };
}
