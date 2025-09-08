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
  address?: {
    address: string;
    city: string;
    country: string;
    firstName: string;
    lastName: string;
    zipCode: string;
  }
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
  recipients: Recipient[];
  attachments: Attachment[];
}

export interface Messages {
  messages: Message[];
}