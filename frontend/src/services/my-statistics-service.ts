import { useEffect, useMemo, useState } from 'react';
import { apiService } from '@services/api-service';
import {
  LetterListItem,
  Letter,
  Message,
  PagingMetaData,
  RecAttachment,
  SigningInfo,
  UserLetters,
} from '@interfaces/statistics.interface';

export interface UserRecLetters {
  _meta: PagingMetaData;
  letters: RecLetter[];
}

export interface RecLetter {
  id: string;
  subject: string;
  municipalityId: string;
  status: string;
  body: string;
  contentType: string;
  created: string;
  updated: string;
  supportInfo: RecSupportInfo;
  attachments: RecAttachment[];
}

export interface RecSupportInfo {
  supportText: string;
  contactInformationUrl: string;
  contactInformationPhoneNumber: string;
  contactInformationEmail: string;
}
export interface AttachmentResponse {
  data: ArrayBuffer;
  error?: never;
}

export interface AttachmentError {
  data?: never;
  error: number | 'UNKNOWN ERROR';
}

export const useMyStatistics = (): {
  letterListItems: LetterListItem[];
  loaded: boolean;
} => {
  const { letters, lettersLoaded } = useMyLetterList();

  const letterListItems = useMemo<LetterListItem[]>(() => {
    if (!lettersLoaded) return [];

    const items = letters.map<LetterListItem>((letter) => ({
      id: letter.messageId,
      messageType: letter.type,
      sent: letter.sentAt,
      subject: letter.subject,
    }));

    return items.sort((a, b) => {
      const ta = typeof a.sent === 'string' ? new Date(a.sent).getTime() : (a.sent as Date).getTime();
      const tb = typeof b.sent === 'string' ? new Date(b.sent).getTime() : (b.sent as Date).getTime();
      return tb - ta;
    });
  }, [lettersLoaded, letters]);

  return {
    letterListItems: letterListItems,
    loaded: lettersLoaded,
  };
};

export const useMyLetterList = (): {
  letters: Letter[];
  lettersLoaded: boolean;
} => {
  const [letters, setLetters] = useState<Letter[]>([]);
  const [lettersLoaded, setLettersLoaded] = useState<boolean>(false);

  useEffect(() => {
    apiService.get<UserLetters>(`my-statistics`).then((res) => {
      const letters = res?.data?.messages;

      if (letters) {
        setLetters(letters);
      }
      setLettersLoaded(true);
    });
  }, []);

  return { letters, lettersLoaded };
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
    subject: '',
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
      const signingInfo = res?.data;

      if (signingInfo) {
        setSigningInfo(signingInfo);
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
