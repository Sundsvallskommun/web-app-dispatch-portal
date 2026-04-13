import { getApiBase } from '@/config';
import { Address, Recipient } from '@/data-contracts/postportalservice/data-contracts';
import { RequestWithUser } from '@/interfaces/auth.interface';
import { MessageResponseData } from '@/interfaces/message.interface';
import { appendCsvFile } from '@/utils/csv-service/csv-service';
import { getMunicipalityId } from '@/utils/getMunicipalityId';
import { logger } from '@/utils/logger';
import FormData from 'form-data';
import ApiService, { ApiResponse } from './api.service';

export interface LetterRequest {
  subject: string;
  contentType: 'text/plain';
  body: string;
  recipients: Recipient[];
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
export interface CsvRequest {
  subject: string;
  body: string;
  contentType: 'text/plain';
}

export interface CsvSmsRequest {
  message: string;
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
  body?: string;
  files: Express.Multer.File[];
}
interface CsvLetterMessage {
  subject: string;
  body?: string;
  files: Express.Multer.File[];
  csvFile: Express.Multer.File;
}
interface CsvSmsMessage {
  message: string;
  csvFile: Express.Multer.File;
}
interface RecMessage {
  subject: string;
  body?: string;
  recipientPersonId: string;
  files: Express.Multer.File[];
}

export interface SMSDTO {
  message: string;
  recipients: { phoneNumber: string }[];
}

export const sendSmsMessage: (
  req: RequestWithUser,
  api: ApiService,
  recipients: string[],
  message: string,
) => Promise<string[]> = async (req, api, recipients, message) => {
  const data: SMSDTO = {
    message,
    recipients: recipients.map(rec => ({ phoneNumber: rec })),
  };
  const municipalityId = await getMunicipalityId(req);
  const url = `${POSTPORTALSERVICE_PATH}/${municipalityId}/messages/sms`;
  const headers = {
    'X-Sent-By': `type=adAccount; ${req.user.username.toLowerCase()}`,
  };
  return api
    .post<string, SMSDTO>({ url, data, headers }, req.user)
    .then(async (_res: ApiResponse<string>) => {
      return recipients;
    })
    .catch(e => {
      logError('Error when sending sms:', e);
      throw new Error('Error when sending sms');
    });
};

export const sendSmsMessageCsv: (
  req: RequestWithUser,
  api: ApiService,
  message: CsvSmsMessage,
) => Promise<MessageResponseData> = async (req, api, message) => {
  const municipalityId = await getMunicipalityId(req);
  const { message: smsMessage, csvFile } = message;
  const url = `${POSTPORTALSERVICE_PATH}/${municipalityId}/messages/sms/csv`;

  const requestContentType = 'application/json';

  const request: CsvSmsRequest = {
    message: smsMessage,
  };

  const form = new FormData();
  form.append('request', JSON.stringify(request), {
    contentType: requestContentType,
  });

  appendCsvFile(csvFile, 'csv-file', form);

  const headers = {
    ...form.getHeaders(),
    'X-Sent-By': `type=adAccount; ${req.user.username.toLowerCase()}`,
  };

  return api
    .post<string, FormData>({ url, data: form, headers }, req.user)
    .then(async () => {
      return { csv: true };
    })
    .catch(e => {
      const errorMessage = 'Error when sending message';
      console.error(`${errorMessage}:`, e);
      logger.error(`${errorMessage}:`, e);
      throw e;
    });
};

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
  req: RequestWithUser,
  api: ApiService,
  recipients: Recipient[],
  message: Message,
  addresses: Address[],
) => Promise<MessageResponseData> = async (req, api, recipients, message, addresses) => {
  const { subject, files, body } = message;
  const municipalityId = await getMunicipalityId(req);
  const url = `${POSTPORTALSERVICE_PATH}/${municipalityId}/messages/letter`;

  const request: LetterRequest = {
    subject: subject,
    contentType: 'text/plain',
    recipients: recipients,
    addresses: addresses,
    body: body ?? '-',
  };

  const form = new FormData();

  form.append('request', JSON.stringify(request), {
    contentType: 'application/json',
  });

  appendPdfAttachments(form, files);

  const headers = {
    ...form.getHeaders(),
    'X-Sent-By': `type=adAccount; ${req.user.username.toLowerCase()}`,
  };

  return api
    .post<string, FormData>({ url, data: form, headers }, req.user)
    .then(async () => {
      return { recipients, addresses };
    })
    .catch(e => {
      const errorMessage = 'Error when sending message';
      console.error(`${errorMessage}:`, e);
      logger.error(`${errorMessage}:`, e);
      throw e;
    });
};

export const sendRecLetter: (
  req: RequestWithUser,
  api: ApiService,
  message: RecMessage,
) => Promise<MessageResponseData> = async (req, api, message) => {
  const municipalityId = await getMunicipalityId(req);
  const { subject, files, body, recipientPersonId } = message;
  const url = `${POSTPORTALSERVICE_PATH}/${municipalityId}/messages/registered-letter`;

  const request = {
    body: body ?? '-',
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
    'X-Sent-By': `type=adAccount; ${req.user.username.toLowerCase()}`,
  };

  return api
    .post<string, FormData>({ url, data: form, headers }, req.user)
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

export const sendLetterCsv: (
  req: RequestWithUser,
  api: ApiService,
  message: CsvLetterMessage,
) => Promise<MessageResponseData> = async (req, api, message) => {
  const municipalityId = await getMunicipalityId(req);
  const { subject, files, body, csvFile } = message;
  const url = `${POSTPORTALSERVICE_PATH}/${municipalityId}/messages/letter/csv`;

  const requestContentType = 'application/json';

  const request = {
    subject: subject,
    contentType: 'text/plain',
    body: body ?? '-',
  } as CsvRequest;

  const form = new FormData();
  // Append request
  form.append('request', JSON.stringify(request), {
    contentType: requestContentType,
  });

  // Append attachment files
  appendPdfAttachments(form, files);

  // Append csv file
  appendCsvFile(csvFile, 'csv-file', form);

  const headers = {
    ...form.getHeaders(),
    'X-Sent-By': `type=adAccount; ${req.user.username.toLowerCase()}`,
  };

  return api
    .post<string, FormData>({ url, data: form, headers }, req.user)
    .then(async () => {
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
