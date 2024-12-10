import { luhnCheck } from '@/utils/util';
import dayjs from 'dayjs';
import ApiService from './api.service';
import { parseCsv } from './csv-service/csv-service';

const MAX_RECIPIENT_ROW_SIZE = 250;

export interface Recipient {
  personnumber: string;
}

export interface CitizenId {
  personNumber: string;
  personId: string;
  success: boolean;
  errorMessage: string;
}

export interface Citizenaddress {
  personId: string;
  givenname: string;
  lastname: string;
  personNumber: string;
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
  error?: 'MISSING' | 'INVALID_SSN' | 'MINOR' | 'UNKNOWN';
}

const isMinor: (ssn: string) => boolean = ssn => {
  const YYYYMMDD = ssn.length === 12 ? ssn.slice(0, 8) : ssn;
  const dob = dayjs(YYYYMMDD);
  const today = dayjs();
  const lessThanEighteenYearsOld = dob.isAfter(today.subtract(18, 'year'));
  return lessThanEighteenYearsOld;
};

export const buildRecipientListFromPersonnumber: (api: ApiService, personnumber: string) => Promise<RecipientWithAddress[]> = async (
  api,
  personnumber,
) => {
  if (isMinor(personnumber)) {
    return [{ recipient: { personnumber }, error: 'MINOR' }];
  } else if (!luhnCheck(personnumber)) {
    return [{ recipient: { personnumber }, error: 'INVALID_SSN' }];
  } else {
    try {
      const address = await fetchAddressesForSsn(api, [personnumber]);
      return [{ recipient: { personnumber }, error: address[0]?.errorMessage ? 'MISSING' : undefined, address: address[0] }];
    } catch (error) {
      console.error('Error occurred while fetching addresses:', error);
      throw error;
    }
  }
};

export const buildRecipientsList: (api: ApiService, csvString: string) => Promise<RecipientWithAddress[]> = async (api, csvString) => {
  const recipients: Recipient[] = parseCsv(csvString);

  if (recipients.length > MAX_RECIPIENT_ROW_SIZE) {
    throw new Error('MAX_RECIPIENT_ROW_SIZE');
  }

  const [invalidRecipients, validRecipients] = recipients.reduce(
    ([invalid, valid], recipient) => {
      recipient.personnumber = recipient.personnumber.replace(/\D/g, '');
      if (recipient.personnumber.length !== 12) {
        return [[...invalid, { recipient, error: 'INVALID_SSN' }], valid];
      } else if (isMinor(recipient.personnumber)) {
        return [[...invalid, { recipient, error: 'MINOR' }], valid];
      } else if (!luhnCheck(recipient.personnumber)) {
        return [[...invalid, { recipient, error: 'INVALID_SSN' }], valid];
      } else {
        return [invalid, [...valid, recipient]];
      }
    },
    [[], []],
  );

  try {
    const addresses = await fetchAddressesForSsn(
      api,
      validRecipients.map(recipient => recipient.personnumber),
    );
    const recipientsWithAddresses: RecipientWithAddress[] = validRecipients.map(recipient => {
      const address = addresses.find(address => address.personNumber === recipient.personnumber);
      const error = address.errorMessage ? 'MISSING' : undefined;

      return { recipient, error, address };
    });

    return [...recipientsWithAddresses, ...invalidRecipients];
  } catch (error) {
    console.error('Error occurred while fetching addresses:', error);
    throw error;
  }
};

export const fetchAddressesForSsn = async (api: ApiService, identifiers: string[]): Promise<Citizenaddress[]> => {
  const citizens = await api.post<CitizenId[], any>({ url: 'citizen/2.0/guid/batch', data: identifiers }).then(res => res.data);
  const validCitizens = citizens.filter(citizen => citizen.personId);
  const addresses = await api
    .post<Citizenaddress[], any>({ url: 'citizen/2.0/batch', data: validCitizens.map(citizen => citizen.personId) })
    .then(res => res.data);
  return citizens.map(citizen => ({ ...citizen, ...addresses.find(address => address.personId === citizen.personId) }));
};
