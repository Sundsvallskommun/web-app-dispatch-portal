import { useEffect, useMemo, useState } from 'react';
import { apiService } from '@services/api-service';
import {
  LetterListItem,
  Letter,
  PagingMetaData,
  RecAttachment,
  UserLetters,
  UserMessage,
  createEmptyUserMessage,
  SigningInfo,
} from '@interfaces/statistics.interface';
import { AxiosError } from 'axios';

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
  const [message, setMessage] = useState<UserMessage>(createEmptyUserMessage());
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

export const useGetSigningInfo = (letterId: string) => {
  const [data, setData] = useState<SigningInfo | null>(null);

  useEffect(() => {
    if (!letterId) return;

    const fetchData = async () => {
      try {
        const res = await apiService.get<SigningInfo>(`signing-info/${letterId}`);
        setData(res.data);
      } catch (err) {
        console.error(`Something went wrong when requesting signing information: ${err}`);
      }
    };

    fetchData();
  }, [letterId]);

  return { data };
};

export const useDownloadReceipt = (signingInfoData: SigningInfo | null) => {
  const [isLoading, setIsLoading] = useState(false);

  const download = async (messageId: string): Promise<{ fileName: string; success: boolean }> => {
    setIsLoading(true);

    try {
      const res = await apiService.get<Blob>(`receipt/${messageId}`, {
        responseType: 'blob',
      });

      const blob = res.data;
      const blobUrl = globalThis.URL.createObjectURL(blob);

      const a = document.createElement('a');
      a.href = blobUrl;
      a.download = signingInfoData
        ? `${signingInfoData.user.givenName}-${signingInfoData.user.surname}-${signingInfoData.user.personalIdentityNumber}-mottagningsbevis.pdf`
        : `mottagningsbevis-${messageId}.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();

      globalThis.URL.revokeObjectURL(blobUrl);

      return { fileName: a.download, success: true };
    } catch (err) {
      const e = err as AxiosError;
      console.error(`Something went wrong while downloading receipt: ${e.message}`);
      return { fileName: '', success: false };
    } finally {
      setIsLoading(false);
    }
  };

  return { download, isLoading };
};

export const getAttachmentFile: (attachmentId: string) => Promise<AttachmentResponse | AttachmentError> = (
  attachmentId
) =>
  apiService
    .get<ArrayBuffer>(`/my-statistics/attachment/${attachmentId}`, { responseType: 'arraybuffer' })
    .then((res) => res)
    .catch((e) => ({ error: e.response?.status ?? 'UNKNOWN ERROR' }));
