import { getApiBase, MUNICIPALITY_ID } from '@/config';
import ApiService, { ApiResponse } from './api.service';
import { RecipientWithAddress } from './recipient.service';
import { User } from '@/interfaces/users.interface';
import FormData from 'form-data';
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
  subject: string;
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
export interface CsvLetterRequest {
  subject: string;
  body: string;
  contentType: 'text/plain';
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

const POSTPORTALSERVICE_PATH = getApiBase('postportalservice');

interface Message {
  subject: string;
  body: string;
  files: Express.Multer.File[];
}
interface CsvMessage {
  subject: string;
  body: string;
  files: Express.Multer.File[];
  csvFile: Express.Multer.File;
}
interface RecMessage {
  subject: string;
  body: string;
  recipientPersonId: string;
  files: Express.Multer.File[];
}

export interface SMSDTO {
  message: string;
  recipients: { phoneNumber: string }[];
}

export const sendSmsMessage: (
  user: User,
  api: ApiService,
  recipients: string[],
  message: string,
) => Promise<string[]> = async (user, api, recipients, message) => {
  const data: SMSDTO = {
    message,
    recipients: recipients.map(rec => ({ phoneNumber: rec })),
  };
  const url = `${POSTPORTALSERVICE_PATH}/${MUNICIPALITY_ID}/messages/sms`;
  const headers = {
    'X-Sent-By': `type=adAccount; ${user.username.toLowerCase()}`,
  };
  return api
    .post<string, SMSDTO>({ url, data, headers }, user)
    .then(async (_res: ApiResponse<string>) => {
      return recipients;
    })
    .catch(e => {
      logError('Error when sending sms:', e);
      throw new Error('Error when sending sms');
    });
};

export type MessageResponseData =
  | {
      recipients: RecipientWithAddress[];
    }
  | { recipientPersonId: string }
  | { csv: boolean };

export type MessageResponse = ApiResponse<MessageResponseData>;

function appendPdfAttachments(form: FormData, files?: Express.Multer.File[]): void {
  if (!files?.length) return;

  for (const file of files) {
    if (file.mimetype !== 'application/pdf') {
      throw new Error(`Invalid mimetype "${file.mimetype}" — only application/pdf is allowed`);
    }

    if (!Buffer.isBuffer(file.buffer)) {
      throw new TypeError(`Missing or invalid buffer for file: ${file.originalname}`);
    }

    form.append('attachments', file.buffer, {
      filename: file.originalname,
      contentType: 'application/pdf',
    });
  }
}

export const sendLetter: (
  user: User,
  api: ApiService,
  recipients: RecipientWithAddress[],
  message: Message,
  addresses: Address[],
) => Promise<MessageResponseData> = async (user, api, recipients, message, addresses) => {
  const { subject, files, body } = message;
  const url = `${POSTPORTALSERVICE_PATH}/${MUNICIPALITY_ID}/messages/letter`;

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

  appendPdfAttachments(form, files);

  const headers = {
    ...form.getHeaders(),
    'X-Sent-By': `type=adAccount; ${user.username.toLowerCase()}`,
  };

  return api
    .post<string, FormData>({ url, data: form, headers }, user)
    .then(async (_res: ApiResponse<string>) => {
      return { recipients };
    })
    .catch(e => {
      const errorMessage = 'Error when sending message';
      console.error(`${errorMessage}:`, e);
      logger.error(`${errorMessage}:`, e);
      throw e;
    });
};

export const sendRecLetter: (user: User, api: ApiService, message: RecMessage) => Promise<MessageResponseData> = async (
  user,
  api,
  message,
) => {
  const { subject, files, body, recipientPersonId } = message;
  const url = `${POSTPORTALSERVICE_PATH}/${MUNICIPALITY_ID}/messages/registered-letter`;

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

  appendPdfAttachments(form, files);

  const headers = {
    ...form.getHeaders(),
    'X-Sent-By': `type=adAccount; ${user.username.toLowerCase()}`,
  };

  return api
    .post<string, FormData>({ url, data: form, headers }, user)
    .then(async (res: ApiResponse<string>) => {
      return { recipientPersonId: recipientPersonId };
    })
    .catch(e => {
      const errorMessage = 'Error when sending registered letter';
      console.error(`${errorMessage}:`, e);
      logger.error(`${errorMessage}:`, e);
      throw e;
    });
};

export const sendLetterCsv: (user: User, api: ApiService, message: CsvMessage) => Promise<MessageResponseData> = async (
  user,
  api,
  message,
) => {
  const { subject, files, body, csvFile } = message;
  const url = `${POSTPORTALSERVICE_PATH}/${MUNICIPALITY_ID}/messages/letter/csv`;

  const requestContentType = 'application/json';
  const csvContentType = 'text/csv';

  const request = {
    subject: subject,
    contentType: 'text/plain',
    body: body ?? 'This is the body of the registered letter.',
  } as CsvLetterRequest;

  const form = new FormData();
  // Append request
  form.append('request', JSON.stringify(request), {
    contentType: requestContentType,
  });

  // Append attachment files
  appendPdfAttachments(form, files);

  // Append csv file
  if (csvFile.mimetype !== csvContentType) {
    throw new Error('Wrong csv file mimetype; must be text/csv');
  }
  if (!Buffer.isBuffer(csvFile.buffer)) {
    throw new TypeError('Csv file buffer missing');
  }
  form.append('csv-file', csvFile.buffer, {
    filename: csvFile.originalname,
    contentType: csvContentType,
  });

  const headers = {
    ...form.getHeaders(),
    'X-Sent-By': `type=adAccount; ${user.username.toLowerCase()}`,
  };

  return api
    .post<string, FormData>({ url, data: form, headers }, user)
    .then(async (res: ApiResponse<string>) => {
      return { csv: true };
    })
    .catch(e => {
      const errorMessage = 'Error when sending message';
      console.error(`${errorMessage}:`, e);
      logger.error(`${errorMessage}:`, e);
      throw e;
    });
};

export const logError = (errorMessage: string, e: any) => {
  console.error(`${errorMessage}:`, e);
  logger.error(`${errorMessage}:`, e);
};
