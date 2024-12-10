import { apiService } from '@services/api-service';
import { __DEV__ } from '@sk-web-gui/react';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { LetterResponse } from './message-service';

export const MAX_RECIPIENT_FILE_SIZE_MB = 50;
export const MAX_RECIPIENT_ROW_SIZE = 250;

export interface Recipient {
  personnumber: string;
}

type RecipientError = 'MISSING' | 'INVALID_SSN' | 'MINOR' | 'UNKNOWN';

export interface Citizenaddress {
  personId: string;
  givenname: string;
  lastname: string;
  addresses: [
    {
      realEstateDescription: string;
      co: string;
      address: string;
      addressArea: string;
      addressNumber: string;
      addressLetter: string;
      appartmentNumber: string;
      postalCode: string;
      city: string;
      country: string;
    },
  ];
  errorMessage?: string;
}

export interface RecipientWithAddress {
  recipient: Recipient;
  address?: Citizenaddress;
  error?: RecipientError;
}

export const ssnPattern = /^$|^((19|20)[0-9]{6}-?[0-9]{4})$/gi;

export const mapRecipientError = (e: RecipientError) => {
  switch (e) {
    case 'MISSING':
      return 'Saknas';
    case 'INVALID_SSN':
      return 'Ogiltig';
    case 'MINOR':
      return 'Minderårig';
    default:
      return 'Okänt fel';
  }
};
export const mapRecipientErrorToColor = (e: RecipientError) => {
  switch (e) {
    case 'MISSING':
      return 'warning';
    case 'INVALID_SSN':
      return 'error';
    case 'MINOR':
      return 'juniskar';
    default:
      return 'vattjom';
  }
};

export const toBase64: (file: File) => Promise<string> = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });

export const getRecipients = async (files: { file?: File }[]): Promise<RecipientWithAddress[]> => {
  const uploadPromises = files.map(async (f) => {
    const fileItem = f.file;
    if (!fileItem) {
      throw new Error('NO_FILE');
    }
    if (fileItem.size / 1024 / 1024 > MAX_RECIPIENT_FILE_SIZE_MB) {
      throw new Error('MAX_SIZE');
    }
    const fileData = await toBase64(fileItem);
    const buf = Buffer.from(fileData.split(',')[1], 'base64');
    const blob = new Blob([buf], { type: fileItem.type });

    // Building form data
    const formData = new FormData();
    formData.append(`files`, blob, fileItem.name);

    const postFile = () =>
      apiService
        .post<{ data: RecipientWithAddress[] }, FormData>(`recipients`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        })
        .then((r) => r.data.data)
        .catch((e) => {
          if (e.response.data.message === 'MAX_RECIPIENT_ROW_SIZE') {
            throw new Error('MAX_RECIPIENT_ROW_SIZE');
          }
          console.error('Something went wrong when posting recipient list.');
          throw e;
        });
    return postFile();
  });
  const res = await Promise.all(uploadPromises);
  return res[0];
};

export const getRecipient = async (personnumber: string): Promise<RecipientWithAddress[]> => {
  return apiService
    .post<{ data: RecipientWithAddress[] }, { personnumber: string }>('recipient', { personnumber })
    .then((r) => r.data.data)
    .catch((e) => {
      console.error('Something went wrong when posting recipient list.');
      throw e;
    });
};

interface State {
  recipients: RecipientWithAddress[];
  response?: { recipients: RecipientWithAddress[]; response: LetterResponse };
}
interface Actions {
  setRecipients: (rs: RecipientWithAddress[]) => void;
  setResponse: (r: { recipients: RecipientWithAddress[]; response: LetterResponse } | undefined) => void;
  reset: () => void;
}

const initialState: State = {
  recipients: [],
  response: undefined,
};

export const useMessageStore = create<State & Actions>()(
  devtools(
    (set) => ({
      ...initialState,
      setRecipients: (recipients) => set(() => ({ recipients })),
      setResponse: (response) => set(() => ({ response })),
      reset: () => {
        set(initialState);
      },
    }),
    { enabled: __DEV__ }
  )
);
