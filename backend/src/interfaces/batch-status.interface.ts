import { DigitalMailAttachment } from '@/services/message.service';
import { Citizenaddress } from '@/services/recipient.service';

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

export interface DeliveryInformation {
  messageType: 'DIGITAL_MAIL' | 'SNAIL_MAIL';
  status: 'SENT' | 'FAILED';
  content:
    | {
        party: {
          partyIds: string[];
        };
        sender: {};
        subject: string;
        contentType: string;
        body: string;
        attachments: DigitalMailAttachment[];
      }
    | {
        department: string;
      };
  timestamp: string;
}
[];

export interface MessageInformation {
  messageId: string;
  deliveries: {
    delivery: DeliveryInformation;
    recipient: Citizenaddress;
  }[];
}
