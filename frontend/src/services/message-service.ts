import { Attachment } from '@components/attachment-handler/attachment-handler';
import { SMSRequest, SMSStatus } from '@interfaces/sms';
import { FormModel } from '@pages/send/mail';
import { Address, Message, MessageApiResponse, Recipient } from 'src/data-contracts/backend/data-contracts';
import { ApiResponse, apiService } from './api-service';
import { file2blob, FileInfo } from '@utils/file.utils';

export const mapMessageType = (key: 'DIGITAL_MAIL' | 'SNAIL_MAIL') => {
  switch (key) {
    case 'DIGITAL_MAIL':
      return 'Digitalpost';
    case 'SNAIL_MAIL':
      return 'Papperspost';
    default:
      return key;
  }
};

export const sendSms: (data: SMSRequest) => Promise<SMSStatus> = async (data) => {
  const res = await apiService.post<ApiResponse<SMSStatus>, SMSRequest>(`sms`, data).catch((e) => {
    console.error('Something went wrong when sending sms:', e);
    throw e;
  });

  return res.data.data;
};

export const sendCsvSms = async (message: string, csvId: string): Promise<MessageApiResponse> => {
  const res = await apiService.post<MessageApiResponse, { message: string; csvId: string }>('csv-sms', {
    message,
    csvId,
  });

  return res.data;
};

const getAttachmentsBlob = async (attachmentList: Attachment[]) => {
  const attachmentPromises: Promise<{ attachment: FileInfo; blob: Blob }>[] =
    attachmentList?.map(async (attachmentFile) => {
      const fileItem = attachmentFile.file;
      if (!fileItem) {
        throw new Error('Attachment is missing its file.');
      }
      const blobObject = await file2blob(fileItem);
      return blobObject;
    }) || [];

  return await Promise.allSettled(attachmentPromises);
};

// Use multipart/form-data
export const sendMessage: (
  data: FormModel,
  recipients: Recipient[],
  addresses: Partial<Recipient>[]
) => Promise<Message> = async (data, recipients, _addresses) => {
  const messageFormData = new FormData();
  const addresses: Address[] = _addresses.map((recipient) => recipient.address).filter((address) => !!address);
  const attachmentList = data.attachmentList;
  const attachmentResults = await getAttachmentsBlob(attachmentList);

  for (const result of attachmentResults) {
    if (result.status === 'fulfilled') {
      const attachment = result.value.attachment;
      const blob = result.value.blob;
      messageFormData.append(`files`, blob, attachment.name);
    } else {
      console.error(`Error: attachment could not be processed for the following reason: ${result.reason}`);
    }
  }

  messageFormData.append('subject', data.subject);
  messageFormData.append('recipients', JSON.stringify(recipients));
  messageFormData.append('addresses', JSON.stringify(addresses));

  const res = await apiService
    .post<MessageApiResponse, FormData>(`message`, messageFormData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    .catch((e) => {
      console.error('Something went wrong when sending message:', e);
      throw e;
    });

  return res.data.data;
};

export const sendCsvMessage: (data: FormModel) => Promise<Message> = async (data) => {
  if (!data.recipientList[0]) {
    throw new Error('No csv file included');
  }

  const messageFormData = new FormData();
  const attachmentList = data.attachmentList;
  const attachmentResults = await getAttachmentsBlob(attachmentList);

  for (const result of attachmentResults) {
    if (result.status === 'fulfilled') {
      const attachment = result.value.attachment;
      const blob = result.value.blob;
      messageFormData.append(`files`, blob, attachment.name);
    } else {
      console.error(`Error: attachment could not be processed for the following reason: ${result.reason}`);
    }
  }

  messageFormData.append('subject', data.subject);
  messageFormData.append('csvId', data.recipientList[0].id);

  return apiService
    .post<MessageApiResponse, FormData>(`csv-message`, messageFormData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    .then((res) => res.data.data);
};

export const sendRecMessage: (formData: FormModel, recipientPersonId: string) => Promise<Message> = async (
  data,
  recipientPersonId
) => {
  const messageFormData = new FormData();

  const attachmentList = data.attachmentList;
  const attachmentResults = await getAttachmentsBlob(attachmentList);

  for (const result of attachmentResults) {
    if (result.status === 'fulfilled') {
      const attachment = result.value.attachment;
      const blob = result.value.blob;
      messageFormData.append(`files`, blob, attachment.name);
    } else {
      console.error(`Error: attachment could not be processed for the following reason: ${result.reason}`);
    }
  }

  messageFormData.append('subject', data.subject);
  messageFormData.append('recipientPersonId', recipientPersonId);

  const res = await apiService
    .post<MessageApiResponse, FormData>(`rec-message`, messageFormData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    .catch((e) => {
      console.error('Something went wrong when sending message:', e);
      throw e;
    });

  return res.data.data;
};
