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
  messageId: string;
  issuer: string;
  origin: string;
  sent: string;
  subject: string;
  body: string;
  recipients: Recipient[];
  attachments: MessageAttachment[];
}

export interface Recipient {
  personId?: string;
  mobileNumber?: string;
  messageType: string;
  status: string;
}

export interface MessageAttachment {
  contentType: string;
  fileName: string;
}

export interface UserBatches {
  _meta: PagingMetaData;
  batches: Batch[];
}
export interface UserLetters {
  _meta: PagingMetaData;
  messages: Letter[];
}
export enum EnumLetterType {
  SMS = 'SMS',
  LETTER = 'LETTER',
  DIGITAL_REGISTERED_LETTER = 'DIGITAL_REGISTERED_LETTER',
}
export enum EnumLetterState {
  NEW = 'NEW',
  SENT = 'SENT',
  SIGNED = 'SIGNED',
  EXPIRED = 'EXPIRED',
  FAILED_Client_Error = 'FAILED - Client Error',
  FAILED_Server_Error = 'FAILED - Server Error',
  FAILED_Unknown_Error = 'FAILED - Unknown Error',
}
export enum EnumSigningState {
  PENDING = 'PENDING',
  COMPLETED = 'COMPLETED',
  FAILED = 'FAILED',
}
export interface Letter {
  messageId: string;
  subject: string;
  type: EnumLetterType;
  sentAt: string;
  signingStatus: {
    letterState: EnumLetterState;
    signingProcessState: EnumSigningState;
  };
  numberOfRecipients: number;
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
  signed: string;
  contentKey: string;
  orderRef: string;
  user: {
    personalIdentityNumber: string;
    name: string;
    givenName: string;
    surname: string;
  };
  device: {
    ipAddress: string;
  };
}
