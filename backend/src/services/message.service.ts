import { getApiBase, MUNICIPALITY_ID } from '@/config';
import ApiService, { ApiResponse } from './api.service';
import { Citizenaddress, RecipientWithAddress } from './recipient.service';
import { User } from '@/interfaces/users.interface';
import FormData from 'form-data';
import { logger } from '@/utils/logger';
import { RequestWithUser } from '@/interfaces/auth.interface';
import { BatchStatus, DeliveryInformation, MessageInformation } from '@/interfaces/batch-status.interface';

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

const MESSAGING_SERVICE = `messaging/7.9`;
const POSTPORTALSERVICE_PATH = getApiBase('postportalservice');

export const sendEmail: (
  user: User,
  api: ApiService,
  senderPersonId: string,
  emailAddress: string,
  messageBody: string,
) => Promise<boolean> = (user, api, senderPersonId, emailAddress, messageBody) => {
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
      logError('Error when sending message:', e);
      throw e;
    });

  return res;
};

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

export const fetchBatchStatus = async (
  user: RequestWithUser['user'],
  batchId: string,
  api: ApiService,
): Promise<BatchStatus> => {
  const url = `${MESSAGING_SERVICE}/${MUNICIPALITY_ID}/status/batch/${batchId}`;
  const response = await api.get<BatchStatus>({ url }, user);
  return response.data;
};

export const fetchMessageInformation = async (
  user: RequestWithUser['user'],
  messageId: string,
  api: ApiService,
): Promise<MessageInformation> => {
  const messageUrl = `${MESSAGING_SERVICE}/${MUNICIPALITY_ID}/message/${messageId}`;

  try {
    const res = await api.get<DeliveryInformation[]>({ url: messageUrl }, user);
    const deliveries = await buildDeliveriesWithRecipients(user, res.data, api);

    return {
      messageId,
      deliveries,
    };
  } catch (e) {
    logger.error('Error when fetching message information:', e);
    // keep same behavior as original (return error instead of throwing)
    return e as unknown as MessageInformation;
  }
};

const buildDeliveriesWithRecipients = async (
  user: RequestWithUser['user'],
  deliveries: DeliveryInformation[],
  api: ApiService,
): Promise<{ delivery: DeliveryInformation; recipient: Citizenaddress }[]> => {
  const deliveryPromises = deliveries.map(delivery => attachRecipientToDelivery(user, delivery, api));

  const results = await Promise.allSettled(deliveryPromises);

  // Filter out rejected + undefined values
  return results
    .filter(r => r.status === 'fulfilled' && r.value !== undefined)
    .map(
      r =>
        (
          r as PromiseFulfilledResult<{
            delivery: DeliveryInformation;
            recipient: Citizenaddress;
          }>
        ).value,
    );
};

const attachRecipientToDelivery = async (
  user: RequestWithUser['user'],
  delivery: DeliveryInformation,
  api: ApiService,
): Promise<{ delivery: DeliveryInformation; recipient: Citizenaddress } | undefined> => {
  // no "party" key – nothing to do
  if (!Object.prototype.hasOwnProperty.call(delivery.content, 'party')) {
    return undefined;
  }

  const party = delivery.content['party'] as { partyIds?: string; partyId?: string };
  const partyId = party.partyIds || party.partyId;

  if (!partyId) {
    const errorMessage = 'No partyId for reciever, cannot fetch adress.';
    logger.error(errorMessage);
    console.error(errorMessage);
    return undefined;
  }

  try {
    const citizenUrl = `citizen/3.0/${partyId}`;
    const person = await api.get<Citizenaddress>({ url: citizenUrl }, user).catch(e => {
      logError('Error when fetching recipient adress', e);
      return undefined;
    });

    if (!person) return undefined;

    return { delivery, recipient: person.data };
  } catch (e) {
    logError('Error when fetching recipient adress', e);
    return undefined;
  }
};
