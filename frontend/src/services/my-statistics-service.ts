import { useEffect, useMemo, useState } from 'react';
import { apiService } from '@services/api-service';
import {
  LetterListItem,
  Letter,
  PagingMetaData,
  RecAttachment,
  SigningInfo,
  UserLetters,
  UserMessage,
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

export const useMessage = (messageId: string): { message: UserMessage; loaded: boolean } => {
  const [message, setMessage] = useState<UserMessage>({
    attachments: [],
    recipients: [],
    sentAt: '',
    subject: '',
    body: '',
  });
  const [loaded, setLoaded] = useState<boolean>(false);

  useEffect(() => {
    if (!messageId) {
      setLoaded(true);
      return;
    }
    apiService.get<UserMessage>(`my-statistics/${messageId}`).then((res) => {
      if (!res.data) return;

      const message = res.data;
      setMessage(message);
      setLoaded(true);
    });
  }, [messageId]);

  return { message, loaded };
};

export const useSigningInfo = (letterId: string): { signingInfo: SigningInfo; loaded: boolean } => {
  const [signingInfo, setSigningInfo] = useState<SigningInfo>({
    status: '',
    signedAt: '',
    contentKey: '',
    orderReference: '',
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

export const getAttachmentFile: (attachmentId: string) => Promise<AttachmentResponse | AttachmentError> = (
  attachmentId
) =>
  apiService
    .get<ArrayBuffer>(`/my-statistics/attachment/${attachmentId}`, { responseType: 'arraybuffer' })
    .then((res) => res)
    .catch((e) => ({ error: e.response?.status ?? 'UNKNOWN ERROR' }));
