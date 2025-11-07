export interface Statistics {
  department: string;
  snailMail?: Mail;
  digitalMail?: Mail;
}

export interface Mail {
  sent: number;
  failed: number;
}

export interface Recipient {
  messageType: string;
  status: string;
  personId?: string;
  mobileNumber?: string;
  address?: {
    address: string;
    city: string;
    country: string;
    firstName: string;
    lastName: string;
    zipCode: string;
  };
}

export interface Attachment {
  contentType: string;
  fileName: string;
}

export interface Message {
  messageId: string;
  issuer: string;
  sent: string;
  subject: string;
  body: string;
  recipients: Recipient[];
  attachments: Attachment[];
}

export interface PagingMetaData {
  page: number;
  limit: number;
  count: number;
  totalRecords: number;
  totalPages: number;
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
export interface UserLetters {
  _meta: PagingMetaData;
  messages: Letter[];
}

export interface LetterListItem {
  id: string;
  messageType: string;
  subject: string;
  sent: string;
}

export interface RecAttachment {
  id: string;
  fileName: string;
  contentType: string;
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
