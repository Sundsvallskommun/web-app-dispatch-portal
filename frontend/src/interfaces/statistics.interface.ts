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

interface PagingMetaData {
  page: number;
  limit: number;
  count: number;
  totalRecords: number;
  totalPages: number;
}

export interface UserBatches {
  _meta: PagingMetaData;
  batches: Batch[];
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

export interface BatchListItem {
  id: string;
  messageType: string;
  subject: string;
  sent: string;
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
