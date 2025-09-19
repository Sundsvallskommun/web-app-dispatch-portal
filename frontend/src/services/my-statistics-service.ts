import { useEffect, useState } from 'react';
import { apiService } from '@services/api-service';
import { Batch, Message, UserBatches } from '@interfaces/statistics.interface';

export interface AttachmentResponse {
  data: ArrayBuffer;
  error?: never;
}

export interface AttachmentError {
  data?: never;
  error: number | 'UNKNOWN ERROR';
}

export const useMyStatistics = (): { batches: Batch[]; loaded: boolean } => {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [loaded, setLoaded] = useState<boolean>(false);

  useEffect(() => {
    apiService.get<UserBatches>(`my-statistics`).then((res) => {
      const batches = res?.data?.batches;

      if (batches) {
        setBatches(batches);
      }
      setLoaded(true);
    });
  }, []);

  return { batches, loaded };
};

export const useMessage = (messageId: string): { message: Message; loaded: boolean } => {
  const [message, setMessage] = useState<Message>({
    subject: '',
    issuer: '',
    sent: '',
    messageId: '',
    recipients: [],
    attachments: [],
  });
  const [loaded, setLoaded] = useState<boolean>(false);

  useEffect(() => {
    if (!messageId) {
      setLoaded(true);
      return;
    }
    apiService.get<Message[]>(`my-statistics/${messageId}`).then((res) => {
      const message = res?.data[0];

      if (message) {
        setMessage(message);
      }
      setLoaded(true);
    });
  }, [messageId]);

  return { message, loaded };
};

export const getAttachmentFile: (
  messageId: string,
  fileName: string
) => Promise<AttachmentResponse | AttachmentError> = (messageId, fileName) =>
  apiService
    .get<ArrayBuffer>(`/my-statistics/attachment/${messageId}/${fileName}`, { responseType: 'arraybuffer' })
    .then((res) => res)
    .catch((e) => ({ error: e.response?.status ?? 'UNKNOWN ERROR' }));
