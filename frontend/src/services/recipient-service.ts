import { apiService } from '@services/api-service';
import { __DEV__ } from '@sk-web-gui/react';
import { useEffect, useState } from 'react';
import {
  Csv,
  CsvApiResponse,
  Message,
  Recipient,
  RecipientApiResponse,
  RecipientDto,
  RecipientNameApiResponse,
} from 'src/data-contracts/backend/data-contracts';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { Recipient as StatisticsRecipient } from '@interfaces/statistics.interface';
import { file2blob } from '@utils/file.utils';

export const MAX_RECIPIENT_FILE_SIZE_MB = 50;
export const MAX_RECIPIENT_ROW_SIZE = 250;

export interface ErrorMessageObj {
  searchPersonnummerBox: string;
}

export const ssnPattern = /^$|^((19|20)[0-9]{6}-?[0-9]{4})$/gi;

export const getRecipient = async (personNumber: string, rek?: boolean): Promise<Recipient> => {
  return apiService
    .post<RecipientApiResponse, RecipientDto>('recipient', { personNumber }, { params: { force_kivra: rek } })
    .then((r) => r.data.data)
    .catch((e) => {
      console.error('Something went wrong when posting recipient list.');
      throw e;
    });
};

interface State {
  recipients: Recipient[];
  addresses: Partial<Recipient>[];
  response?: Message;
}
interface Actions {
  setRecipients: (rs: Recipient[]) => void;
  setAddresses: (addresses: Partial<Recipient>[]) => void;
  setResponse: (r: Message | undefined) => void;
  reset: () => void;
}

const initialState: State = {
  recipients: [],
  addresses: [],
  response: undefined,
};

export const useMessageStore = create<State & Actions>()(
  devtools(
    (set) => ({
      ...initialState,
      setRecipients: (recipients) => set(() => ({ recipients })),
      setAddresses: (addresses) => set(() => ({ addresses })),
      setResponse: (response) => set(() => ({ response })),
      reset: () => {
        set(initialState);
      },
    }),
    { enabled: __DEV__ }
  )
);

export const getCitizenName = async (personId: string): Promise<string> => {
  const result = await apiService
    .get<RecipientNameApiResponse>(`recipient/${personId}/name`)
    .then((res) => res.data)
    .catch((e) => {
      console.error('Something went wrong when getting citizen.');
      throw e;
    });

  return result.data;
};

export const useRecipientName = (recipient?: StatisticsRecipient) => {
  const [name, setName] = useState('');

  useEffect(() => {
    if (!recipient?.partyId) {
      setName('');
      return;
    }

    let cancelled = false;

    getCitizenName(recipient.partyId).then((name) => {
      if (!cancelled && name) {
        setName(name);
      }
    });

    return () => {
      cancelled = true;
    };
  }, [recipient?.partyId]);

  return name;
};

export const checkCsv: (csvFile: File) => Promise<Csv> = async (csvFile) => {
  const messageFormData = new FormData();

  const csvBlob = await file2blob(csvFile);

  messageFormData.append('csv', csvBlob.blob, csvBlob.attachment.name);

  const res = await apiService
    .post<CsvApiResponse, FormData>(`recipient/csv`, messageFormData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    .catch((e) => {
      console.error('Something went wrong when sending message:', e);
      throw e;
    });

  return res.data.data;
};
