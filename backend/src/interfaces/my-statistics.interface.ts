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
