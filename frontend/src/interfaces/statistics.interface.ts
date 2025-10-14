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

export interface Status {
  successful: number;
  unsuccessful: number;
}
