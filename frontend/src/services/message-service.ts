import { BatchStatus, DeliveryInformation, MessageInformation } from '@interfaces/batch-status';
import { FormModel } from '@pages/send/mail';
import { ApiResponse, apiService } from './api-service';
import { AddWithAddress, MessageResponse, RecipientWithAddress, toBase64 } from './recipient-service';
import { SMSRequest, SMSStatus } from '@interfaces/sms';
import { Attachment } from '@components/attachment-handler/attachment-handler';

export const MAX_ATTACHMENT_FILE_SIZE_MB = 1.5;
export interface FileInfo {
  name: string;
  extension: string;
  mimeType: string;
  file: string;
}

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

const file2blob = async (fileItem: File) => {
  if (fileItem.size / 1024 / 1024 > MAX_ATTACHMENT_FILE_SIZE_MB) {
    console.error('File too large.');
    return Promise.reject();
  }
  const fileData = await toBase64(fileItem);
  const attachment: FileInfo = {
    name: fileItem.name,
    extension: fileItem.name.split('.').pop() || '',
    mimeType: fileItem.type,
    file: fileData.split(',')[1],
  };
  const buf = Buffer.from(attachment.file, 'base64');
  const blob = new Blob([new Uint8Array(buf)], { type: attachment.mimeType });
  return { attachment, blob };
};

export const sendSms: (data: SMSRequest) => Promise<SMSStatus> = async (data) => {
  const res = await apiService.post<ApiResponse<SMSStatus>, SMSRequest>(`sms`, data).catch((e) => {
    console.error('Something went wrong when sending sms:', e);
    throw e;
  });

  return res.data.data;
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
  recipients: RecipientWithAddress[],
  addresses: AddWithAddress[]
) => Promise<MessageResponse> = async (data, recipients, addresses) => {
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
  messageFormData.append('recipients', JSON.stringify(recipients));
  messageFormData.append('addresses', JSON.stringify(addresses));

  const res = await apiService
    .post<ApiResponse<MessageResponse>, FormData>(`message`, messageFormData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    .catch((e) => {
      console.error('Something went wrong when sending message:', e);
      throw e;
    });

  return res.data.data;
};

export const sendRecMessage: (formData: FormModel, recipientPersonId: string) => Promise<MessageResponse> = async (
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
    .post<ApiResponse<MessageResponse>, FormData>(`rec-message`, messageFormData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    .catch((e) => {
      console.error('Something went wrong when sending message:', e);
      throw e;
    });

  return res.data.data;
};

export const getBatchStatus: (id: string) => Promise<BatchStatus> = async (id) => {
  if (!id) {
    return Promise.reject('No id supplied');
  }
  const res = await apiService.get<BatchStatus>(`batchstatus/${id}`).catch((e) => {
    console.error('Something went wrong when fetching batch status:', e);
    throw e;
  });
  return res.data;
};

export const getMessageInformation: (id: string) => Promise<DeliveryInformation> = async (id) => {
  if (!id) {
    return Promise.reject('No id supplied');
  }
  const res = await apiService.get<DeliveryInformation>(`message/${id}`).catch((e) => {
    console.error('Something went wrong when fetching message information:', e);
    throw e;
  });
  return res.data;
};

export const getMessagesForBatch: (id: string) => Promise<MessageInformation[]> = async (id) => {
  if (!id) {
    return Promise.reject('No id supplied');
  }
  const res = await apiService.get<MessageInformation[]>(`batchmessages/${id}`).catch((e) => {
    console.error('Something went wrong when fetching message information:', e);
    throw e;
  });
  return res.data;
};
