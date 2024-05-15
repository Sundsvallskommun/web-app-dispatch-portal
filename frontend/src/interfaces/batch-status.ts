import { Citizenaddress } from '@services/recipient-service';

export enum MessageType {
  DIGITAL_MAIL = 'Digitalpost',
  SNAIL_MAIL = 'Papperspost',
}

export enum MessageStatusCode {
  SENT = 'Skickat',
  FAILED = 'Misslyckades',
}

export interface BatchStatus {
  batchId: string;
  messages: MessageStatus[];
}

export interface MessageStatus {
  messageId: string;
  deliveries: DeliveryStatus[];
}

export interface DeliveryStatus {
  deliveryId: string;
  messageType: 'DIGITAL_MAIL' | 'SNAIL_MAIL';
  status: 'SENT' | 'FAILED';
}

export interface SnailMailContent {
  party: {
    partyIds: string[];
  };
  department: string;
  deviation: string;
  attachments: {
    name: string;
    contentType: string;
    content: string;
  }[];
  timestamp: string;
}

export interface DigitalMailContent {
  party: {
    partyIds: string[];
  };
  sender: {
    supportInfo: {
      text: string;
      emailAddress: string;
      phoneNumber: string;
      url: string;
    };
  };
  subject: string;
  contentType: string;
  body: string;
  attachments: [
    {
      contentType: string;
      content: string;
      filename: string;
    }
  ];
  timestamp: string;
}

export type DeliveryInformation =
  | {
      messageType: 'DIGITAL_MAIL';
      status: 'SENT' | 'FAILED';
      content: DigitalMailContent;
      timestamp: string;
    }
  | {
      messageType: 'SNAIL_MAIL';
      status: 'SENT' | 'FAILED';
      content: SnailMailContent;
      timestamp: string;
    };
[];

export interface MessageInformation {
  messageId: string;
  deliveries: {
    delivery: DeliveryInformation;
    recipient: Citizenaddress;
  }[];
}
