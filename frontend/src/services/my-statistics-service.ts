import { useEffect, useState } from 'react';
import { apiService } from '@services/api-service';
import {
  Batch,
  BatchListItem,
  Message,
  RecLetter,
  SigningInfo,
  UserBatches,
  UserRecLetters,
} from '@interfaces/statistics.interface';

export interface AttachmentResponse {
  data: ArrayBuffer;
  error?: never;
}

export interface AttachmentError {
  data?: never;
  error: number | 'UNKNOWN ERROR';
}

export const useMyStatistics = (): {
  batchListItems: BatchListItem[];
  loaded: boolean;
} => {
  const [loaded, setLoaded] = useState<boolean>(false);
  const { batches, batchesLoaded } = useMyMessages();
  const { recLetters, recLoaded } = useMyLetters();

  const [batchListItems, setBatchListItems] = useState<BatchListItem[]>([]);

  useEffect(() => {
    if (batchesLoaded && recLoaded) {
      let batchListItems1 = batches.map((batch) => {
        let batchListItem: BatchListItem = {
          id: batch.batchId,
          messageType: batch.messageType,
          sent: batch.sent,
          subject: batch.subject,
        };
        return batchListItem;
      });
      let batchListItems2 = recLetters.map((letter) => {
        let batchListItem: BatchListItem = {
          id: letter.id,
          messageType: 'REK',
          sent: letter.created,
          subject: letter.body,
        };
        return batchListItem;
      });

      let batchListItems = batchListItems1.concat(batchListItems2).sort((a, b) => (a.sent < b.sent ? 1 : -1));

      setLoaded(true);
      setBatchListItems(batchListItems);
    }
  }, [batchesLoaded, recLoaded, batches, recLetters]);

  return {
    batchListItems,
    loaded,
  };
};

export const useMyMessages = (): {
  batches: Batch[];
  batchesLoaded: boolean;
} => {
  const [batches, setBatches] = useState<Batch[]>([]);
  const [batchesLoaded, setBatchesLoaded] = useState<boolean>(false);

  useEffect(() => {
    apiService.get<UserBatches>(`my-statistics`).then((res) => {
      const batches = res?.data?.batches;

      if (batches) {
        setBatches(batches);
      }
      setBatchesLoaded(true);
    });
  }, []);

  return { batches, batchesLoaded };
};

export const useMyLetters = (): {
  recLetters: RecLetter[];
  recLoaded: boolean;
} => {
  const [recLetters, setRecLetters] = useState<RecLetter[]>([]);
  const [recLoaded, setRecLoaded] = useState<boolean>(false);

  useEffect(() => {
    apiService.get<UserRecLetters>(`my-rec-letters`).then((res) => {
      const letters = res?.data?.letters;

      if (letters) {
        setRecLetters(letters);
      }
      setRecLoaded(true);
    });
  }, []);

  return { recLetters, recLoaded };
};

export const useMessage = (messageId: string): { message: Message; loaded: boolean } => {
  const [message, setMessage] = useState<Message>({
    subject: '',
    body: '',
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
      const filteredMessage = res?.data[0];

      if (filteredMessage) {
        const recipients = res?.data.map((message) => {
          return { ...message?.recipients[0] };
        });
        filteredMessage.recipients = recipients?.flat();
        setMessage(filteredMessage);
      }
      setLoaded(true);
    });
  }, [messageId]);

  return { message, loaded };
};

export const useLetter = (letterId: string): { letter: RecLetter; loaded: boolean } => {
  const [letter, setLetter] = useState<RecLetter>({
    id: '',
    municipalityId: '',
    status: '',
    body: '',
    contentType: '',
    created: '',
    updated: '',
    supportInfo: {
      supportText: '',
      contactInformationUrl: '',
      contactInformationPhoneNumber: '',
      contactInformationEmail: '',
    },
    attachments: [
      {
        id: '',
        fileName: '',
        contentType: '',
      },
    ],
  });
  const [loaded, setLoaded] = useState<boolean>(false);

  useEffect(() => {
    if (!letterId) {
      setLoaded(true);
      return;
    }
    apiService.get<RecLetter>(`my-rec-letters/${letterId}`).then((res) => {
      const letter = res?.data;

      if (letter) {
        setLetter(letter);
      }
      setLoaded(true);
    });
  }, [letterId]);

  return { letter, loaded };
};

export const useSigningInfo = (letterId: string): { signingInfo: SigningInfo; loaded: boolean } => {
  const [signingInfo, setSigningInfo] = useState<SigningInfo>({
    status: '',
    signed: '',
    contentKey: '',
    orderRef: '',
    user: {
      personalIdentityNumber: '',
      name: '',
      givenName: '',
      surname: '',
    },
    device: {
      ipAddress: '',
    },
  });
  const [loaded, setLoaded] = useState<boolean>(false);

  useEffect(() => {
    if (!letterId) {
      setLoaded(true);
      return;
    }
    apiService.get<SigningInfo>(`signing-info/${letterId}`).then((res) => {
      const letter = res?.data;

      if (letter) {
        setSigningInfo(letter);
      }
      setLoaded(true);
    });
  }, [letterId]);

  return { signingInfo, loaded };
};

export const getAttachmentFile: (
  messageId: string,
  fileName: string
) => Promise<AttachmentResponse | AttachmentError> = (messageId, fileName) =>
  apiService
    .get<ArrayBuffer>(`/my-statistics/attachment/${messageId}/${fileName}`, { responseType: 'arraybuffer' })
    .then((res) => res)
    .catch((e) => ({ error: e.response?.status ?? 'UNKNOWN ERROR' }));

export const getRecAttachmentFile: (
  messageId: string,
  fileName: string
) => Promise<AttachmentResponse | AttachmentError> = (letterId, attachmentId) =>
  apiService
    .get<ArrayBuffer>(`/my-rec-letters/attachment/${letterId}/${attachmentId}`, { responseType: 'arraybuffer' })
    .then((res) => res)
    .catch((e) => ({ error: e.response?.status ?? 'UNKNOWN ERROR' }));
