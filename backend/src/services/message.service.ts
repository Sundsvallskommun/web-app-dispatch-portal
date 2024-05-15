import ApiService, { ApiResponse } from './api.service';
import { RecipientWithAddress } from './recipient.service';
import { logger } from '@/utils/logger';

export interface AgnosticMessageResponse {
  messageId: string;
}

export interface EmailRequest {
  party?: {
    partyId: string;
    externalReferences?: [
      {
        key: string;
        value: string;
      },
    ];
  };
  emailAddress: string;
  sender?: {
    name: string;
    address: string;
    replyTo: string;
  };
  subject: string;
  message: string;
  htmlMessage: string;
}

export interface SmsAndEmailRequest {
  messages: {
    party?: {
      partyId: string;
      externalReferences?: [
        {
          key: string;
          value: string;
        },
      ];
    };
    sender?: {
      email: {
        name: string;
        address: string;
        replyTo: string;
      };
      sms: {
        name: string;
      };
    };
    subject: string;
    message: string;
    htmlMessage: string;
  }[];
}

export interface DigitalMailAttachment {
  deliveryMode: 'ANY' | 'DIGITAL_MAIL' | 'SNAIL_MAIL';
  contentType: 'application/pdf';
  content: string;
  filename: string;
}

export interface LetterRequest {
  party?: {
    partyIds: string[];
    externalReferences?: { [key: string]: string }[];
  };
  headers?: [
    {
      name: string;
      values: string[];
    },
  ];
  subject?: string;
  sender: {
    supportInfo: {
      text: string;
      emailAddress: string;
      phoneNumber: string;
      url: string;
    };
  };
  contentType: 'text/plain';
  body: string;
  department: string;
  deviation?: string;
  attachments?: DigitalMailAttachment[];
}

export interface LetterResponse {
  batchId: string;
  messages: [
    {
      messageId: string;
      deliveries: {
        deliveryId: string;
        messageType: 'DIGITAL_MAIL' | 'SNAIL_MAIL';
        status: string;
      }[];
    },
  ];
}

export interface EmailMessageAttachment {
  content: string;
  name?: string;
  filename?: string;
  contentType: 'application/pdf';
}

export interface EmailMessageRequest {
  party?: {
    partyId: string;
    externalReferences: { [key: string]: string }[];
  };
  headers?: [
    {
      name: string;
      values: string[];
    },
  ];
  emailAddress: string;
  subject: string;
  message?: string;
  htmlMessage?: string;
  sender?: {
    name: string;
    address: string;
    replyTo: string;
  };
  attachments?: EmailMessageAttachment[];
}

export const sendEmail: (api: ApiService, senderPersonId: string, emailAddress: string, messageBody: string) => Promise<boolean> = (
  api,
  senderPersonId,
  emailAddress,
  messageBody,
) => {
  console.log(`Composing email message for ${senderPersonId} ${emailAddress}`);
  if (!emailAddress || !senderPersonId) {
    return Promise.resolve(false);
  }
  const url = `messaging/4.1/email?async=false`;

  const req: EmailRequest = {
    party: {
      partyId: senderPersonId,
    },
    emailAddress: emailAddress,
    sender: {
      name: 'Postportalen',
      address: 'no-reply@postportal.sundsvall.se',
      replyTo: 'no-reply@postportal.sundsvall.se',
    },
    subject: 'Status för utskick',
    message: messageBody,
    htmlMessage: btoa(messageBody),
  };

  const res = api
    .post<any, EmailRequest>({ url, data: req })
    .then(async (res: ApiResponse<any>) => {
      return true;
    })
    .catch(e => {
      console.log('Error when sending message:', e);
      throw e;
    });

  return res;
};

export const sendLetter: (
  api: ApiService,
  recipients: RecipientWithAddress[],
  subject: string,
  body: string,
  department: string,
  files: Express.Multer.File[],
) => Promise<{ recipients: RecipientWithAddress[]; response: LetterResponse }> = async (api, recipients, subject, body, department, files) => {
  const url = `messaging/4.1/letter?async=true`;
  const attachments = [];
  files.forEach(f => {
    const base64String = f.buffer.toString('base64');
    const filename = f.originalname;
    const contentType = f.mimetype;
    if (contentType !== 'application/pdf') {
      logger.error('Wrong attachment mimetype when sending letter, must be application/pdf.');
    }
    attachments.push({
      content: base64String,
      filename,
      contentType: 'application/pdf',
      deliveryMode: 'ANY',
    } as DigitalMailAttachment);
  });

  const request = {
    party: {
      partyIds: recipients.map(r => r.address.personId),
    },
    subject: subject,
    contentType: 'text/plain',
    department: department,
    sender: {
      supportInfo: {
        text: 'Vänd dig till Sundsvalls kommun om du har frågor angående detta meddelande.',
        url: 'https://www.sundsvall.se',
      },
    },
  } as LetterRequest;
  if (attachments.length > 0) {
    request.attachments = attachments;
  }

  return api
    .post<LetterResponse, LetterRequest>({ url, data: request })
    .then(async (res: ApiResponse<LetterResponse>) => {
      return { recipients, response: res.data };
    })
    .catch(e => {
      console.log('Error when sending message:', e);
      throw e;
    });
};
