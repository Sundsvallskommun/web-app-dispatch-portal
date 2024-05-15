import { BatchStatus, DeliveryInformation, MessageInformation } from '@interfaces/batch-status';
import { FormModel } from '@pages/index';
import { ApiResponse, apiService } from './api-service';
import { RecipientWithAddress, toBase64 } from './recipient-service';

export const MAX_ATTACHMENT_FILE_SIZE_MB = 2;
export interface Attachment {
  name: string;
  extension: string;
  mimeType: string;
  file: string;
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
    }
  ];
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
  const attachment: Attachment = {
    name: fileItem.name,
    extension: fileItem.name.split('.').pop() || '',
    mimeType: fileItem.type,
    file: fileData.split(',')[1],
  };
  const buf = Buffer.from(attachment.file, 'base64');
  const blob = new Blob([buf], { type: attachment.mimeType });
  return { attachment, blob };
};

// Use multipart/form-data
export const sendMessage: (
  data: FormModel,
  recipients: RecipientWithAddress[]
) => Promise<{ recipients: RecipientWithAddress[]; response: LetterResponse }> = async (data, recipients) => {
  const messageFormData = new FormData();
  const mainAttachment = data.attachmentList.find((attach) => attach.main);

  if (mainAttachment && mainAttachment.file) {
    const mainAttachmentFile = await file2blob(mainAttachment.file);
    messageFormData.append(`files`, mainAttachmentFile.blob, mainAttachmentFile.attachment.name);
  } else {
    console.error('No main attachment found, cannot send message.');
    throw new Error('No main attachment found.');
  }

  const secondaryAttachmentList = data.attachmentList.filter((attach) => !attach.main);
  const secondaryAttachmentPromises: Promise<{ attachment: Attachment; blob: Blob }>[] =
    secondaryAttachmentList?.map(async (f) => {
      const fileItem = f.file;
      if (fileItem) {
        const blobObject = file2blob(fileItem);
        return Promise.resolve(blobObject);
      } else {
        return Promise.reject();
      }
    }) || [];

  const res = await Promise.allSettled(secondaryAttachmentPromises)
    .then((r) => {
      r.forEach((r) => {
        if (r.status === 'fulfilled') {
          const attachment = r.value.attachment;
          const blob = r.value.blob;
          messageFormData.append(`files`, blob, attachment.name);
        } else {
          console.error(`Error: attachment could not be processed for the following reason: ${r.reason}`);
        }
      });
    })
    .then(() => {
      messageFormData.append('department', data.department);
      messageFormData.append('subject', data.subject);
      messageFormData.append('recipients', JSON.stringify(recipients));
      return apiService
        .post<ApiResponse<{ recipients: RecipientWithAddress[]; response: LetterResponse }>, FormData>(
          `message`,
          messageFormData,
          {
            headers: { 'Content-Type': 'multipart/form-data' },
          }
        )
        .catch((e) => {
          console.error('Something went wrong when sending message:', e);
          throw e;
        });
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
