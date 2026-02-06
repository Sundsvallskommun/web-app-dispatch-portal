import { formSendType } from './constants';

export type SendType = (typeof formSendType)[keyof typeof formSendType];

export type QAItem = {
  id: string;
  question: string;
  answer: React.ReactNode;
  tags: string[];
};

export enum EnumQATags {
  SMS = 'sms',
  MAIL = 'mail',
  REK_MAIL = 'rek-mail',
  RECIPIENTS = 'recipients',
  DOCUMENTS = 'documents',
  SENDER = 'sender',
}
