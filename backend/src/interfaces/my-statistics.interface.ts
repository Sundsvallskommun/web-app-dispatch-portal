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

  recipients: Recipient[];
  attachments: MessageAttachment[];
}

export interface Recipient {
  personId: string;
  messageType: string;
  status: string;
}

export interface MessageAttachment {
  contentType: string;
  fileName: string;
}
