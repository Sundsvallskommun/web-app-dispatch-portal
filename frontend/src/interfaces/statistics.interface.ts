export interface Statistics {
  department: string;
  snailMail?: Mail;
  digitalMail?: Mail;
}

export interface Mail {
  sent: number;
  failed: number;
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
  PENDING = 'PENDING',
  INELIGIBLE_MINOR = 'INELIGIBLE_MINOR',
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
  PENDING = 'PENDING',
  SENT = 'SENT',
  SIGNED = 'SIGNED',
  EXPIRED = 'EXPIRED',
  FAILED = 'FAILED',
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

export interface MessageAttachment {
  attachmentId: string;
  contentType: string;
  fileName: string;
}
export interface UserMessage {
  subject?: string;
  body: string;
  sentAt: string;
  attachments: MessageAttachment[];
  recipients: Recipient[];
  signingStatus?: SigningStatus;
}

export interface SigningStatus {
  letterState: EnumLetterState;
  signingProcessState: EnumSigningState;
}

export function createEmptyUserMessage(): UserMessage {
  return {
    attachments: [],
    recipients: [],
    sentAt: '',
    subject: '',
    body: '',
    signingStatus: undefined,
  };
}
