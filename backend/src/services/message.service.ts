import { MUNICIPALITY_ID } from '@/config';
import ApiService, { ApiResponse } from './api.service';
import { RecipientWithAddress } from './recipient.service';
import { logger } from '@/utils/logger';
import { User } from '@/interfaces/users.interface';
import FormData from 'form-data';

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

interface Address {
  firstName: string;
  lastName: string;
  address: string;
  apartmentNumber: string;
  careOf: string;
  zipCode: string;
  city: string;
  country: string;
}

export interface LetterRequest {
  subject?: string;
  contentType: 'text/plain';
  body: string;
  recipients: {
    partyId: string;
    deliveryMethod: string;
    address: {
      firstName: string;
      lastName: string;
      street: string;
      apartmentNumber: string;
      careOf: string;
      zipCode: string;
      city: string;
      country: string;
    };
  }[];
  addresses: Address[];
  headers?: [
    {
      name: string;
      values: string[];
    },
  ];
}
export interface RecLetterRequest {
  subject?: string;
  contentType: 'text/plain';
  body: string;
  partyId: string;
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

const MESSAGING_SERVICE = `messaging/7.9`;

export const sendEmail: (user: User, api: ApiService, senderPersonId: string, emailAddress: string, messageBody: string) => Promise<boolean> = (
  user,
  api,
  senderPersonId,
  emailAddress,
  messageBody,
) => {
  console.log(`Composing email message for ${senderPersonId} ${emailAddress}`);
  if (!emailAddress || !senderPersonId) {
    return Promise.resolve(false);
  }
  const url = `${MESSAGING_SERVICE}/${MUNICIPALITY_ID}/email?async=false`;

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
    .post<any, EmailRequest>({ url, data: req }, user)
    .then(async (res: ApiResponse<any>) => {
      return true;
    })
    .catch(e => {
      console.log('Error when sending message:', e);
      throw e;
    });

  return res;
};

interface Message {
  subject: string;
  body: string;
  files: Express.Multer.File[];
}
interface RecMessage {
  subject: string;
  body: string;
  recipientPersonId: string;
  files: Express.Multer.File[];
}

export const sendLetter: (
  user: User,
  api: ApiService,
  recipients: RecipientWithAddress[],
  message: Message,
  department: string,
  addresses: Address[],
) => Promise<{ recipients: RecipientWithAddress[]; response: LetterResponse }> = async (user, api, recipients, message, department, addresses) => {
  const POSTPORTALSERVICE_PATH = `postportalservice/1.0`;
  const { subject, files, body } = message;
  const url = `${POSTPORTALSERVICE_PATH}/${MUNICIPALITY_ID}/messages/letter`;
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
    subject: subject,
    contentType: 'text/plain',
    recipients: recipients.map(r => {
      const currAddress = r.address.addresses?.length > 0 ? r.address.addresses[0] : undefined;
      return {
        partyId: r.address.personId,
        deliveryMethod: r.address.deliveryMethod,
        address: {
          firstName: r.address.givenname,
          lastName: r.address.lastname,
          street: currAddress.address,
          apartmentNumber: currAddress.appartmentNumber,
          careOf: currAddress.co,
          zipCode: currAddress.postalCode,
          city: currAddress.city,
          country: currAddress.country,
        },
      };
    }),
    addresses: addresses,
    body: body ?? 'This is the body of the registered letter.',
  } as LetterRequest;

  const form = new FormData();
  form.append('request', JSON.stringify(request), {
    contentType: 'application/json',
  });
  if (files?.length) {
    for (const f of files) {
      if (f.mimetype !== 'application/pdf') {
        throw new Error('Wrong attachment mimetype; must be application/pdf');
      }
      if (!Buffer.isBuffer(f.buffer)) {
        throw new Error('Attachment buffer missing');
      }

      form.append('attachments', f.buffer, {
        filename: f.originalname,
        contentType: 'application/pdf',
      });
    }
  }

  const headers = {
    ...form.getHeaders(),
    'X-Sent-By': `type=adAccount; ${user.username.toLowerCase()}`,
  };

  return api
    .post<LetterResponse, FormData>({ url, data: form, headers }, user)
    .then(async (res: ApiResponse<LetterResponse>) => {
      return { recipients, response: res.data };
    })
    .catch(e => {
      console.log('Error when sending message:', e);
      throw e;
    });
};
export const sendRecLetter: (
  user: User,
  api: ApiService,
  message: RecMessage,
) => Promise<{ recipientPersonId: string; response: LetterResponse }> = async (user, api, message) => {
  const POSTPORTALSERVICE_PATH = `postportalservice/1.0`;
  const { subject, files, body, recipientPersonId: recipientPersonId } = message;
  const url = `${POSTPORTALSERVICE_PATH}/${MUNICIPALITY_ID}/messages/registered-letter`;
  const attachments = [];
  files.forEach(f => {
    const base64String = f.buffer.toString('base64');
    const filename = f.originalname;
    const contentType = f.mimetype;
    if (contentType !== 'application/pdf') {
      logger.error('Wrong attachment mimetype when sending a registered letter, must be application/pdf.');
    }
    attachments.push({
      content: base64String,
      filename,
      contentType: 'application/pdf',
      deliveryMode: 'ANY',
    } as DigitalMailAttachment);
  });

  const request = {
    body: body ?? 'This is the body of the registered letter.',
    contentType: 'text/plain',
    subject: subject,
    partyId: recipientPersonId,
  } as RecLetterRequest;

  const form = new FormData();
  form.append('request', JSON.stringify(request), {
    contentType: 'application/json',
  });
  if (files?.length) {
    for (const f of files) {
      if (f.mimetype !== 'application/pdf') {
        throw new Error('Wrong attachment mimetype; must be application/pdf');
      }
      if (!Buffer.isBuffer(f.buffer)) {
        throw new Error('Attachment buffer missing');
      }

      form.append('attachments', f.buffer, {
        filename: f.originalname,
        contentType: 'application/pdf',
      });
    }
  }

  const headers = {
    ...form.getHeaders(),
    'X-Sent-By': `type=adAccount; ${user.username.toLowerCase()}`,
  };

  return api
    .post<LetterResponse, FormData>({ url, data: form, headers }, user)
    .then(async (res: ApiResponse<LetterResponse>) => {
      return { recipientPersonId: recipientPersonId, response: res.data };
    })
    .catch(e => {
      console.log('Error when sending registered letter:', e);
      throw e;
    });
};
