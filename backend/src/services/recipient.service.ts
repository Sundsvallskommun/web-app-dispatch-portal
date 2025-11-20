import { luhnCheck } from '@/utils/util';
import dayjs from 'dayjs';
import ApiService from './api.service';
import { parseCsv } from './csv-service/csv-service';
import { getApiBase, MUNICIPALITY_ID } from '@/config';
import { User } from '@/interfaces/users.interface';
import { RequestWithUser } from '@/interfaces/auth.interface';
import { logger } from '@/utils/logger';

const MAX_RECIPIENT_ROW_SIZE = 250;
const POSTPORTALSERVICE_PATH = getApiBase('postportalservice');

export interface Recipient {
  personnumber: string;
}

export interface CitizenId {
  personNumber: string;
  personId: string;
  success: boolean;
  errorMessage: string;
}
export interface RecipientDeliveryMethods {
  recipients: RecipientDeliveryMethod[];
}
export interface RecipientDeliveryMethod {
  partyId: string;
  deliveryMethod: string;
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
  deliveryMethod: string;
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

export const buildRecipientListFromPersonnumber: (
  user: User,
  api: ApiService,
  personnumber: string,
) => Promise<RecipientWithAddress[]> = async (user, api, personnumber) => {
  if (isMinor(personnumber)) {
    return [{ recipient: { personnumber }, error: 'MINOR' }];
  } else if (!luhnCheck(personnumber)) {
    return [{ recipient: { personnumber }, error: 'INVALID_SSN' }];
  } else {
    try {
      const citizenInfo = await fetchCitizensInfos(user, api, [personnumber]);
      return [
        {
          recipient: { personnumber },
          error: citizenInfo[0]?.errorMessage ? 'MISSING' : undefined,
          address: citizenInfo[0],
        },
      ];
    } catch (error) {
      console.error('Error occurred while fetching addresses:', error);
      throw error;
    }
  }
};

export const buildRecipientsList: (
  user: User,
  api: ApiService,
  csvString: string,
) => Promise<RecipientWithAddress[]> = async (user, api, csvString) => {
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
    const addresses = await fetchCitizensInfos(
      user,
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

export const fetchCitizensInfos = async (
  user: User,
  api: ApiService,
  personalSecurityNumbers: string[],
): Promise<Citizenaddress[]> => {
  const citizens = await fetchCitizens(user, api, personalSecurityNumbers);
  const personIds = citizens.map(citizen => citizen.personId);
  const addresses = await api
    .post<Citizenaddress[], any>({ url: `citizen/3.0/${MUNICIPALITY_ID}/batch`, data: personIds }, user)
    .then(res => res.data);
  const deliveryMethods = await precheckPersonIds(user, api, personIds);

  if (!addresses || addresses.length === 0) {
    throw new Error('NO_VALID_ADDRESSES');
  }
  return citizens.map(citizen => ({
    ...citizen,
    ...addresses.find(address => address.personId === citizen.personId),
    deliveryMethod: deliveryMethods.find(d => d.partyId === citizen.personId)?.deliveryMethod,
  }));
};
export const fetchCitizens = async (
  user: User,
  api: ApiService,
  personalSecurityNumbers: string[],
): Promise<CitizenId[]> => {
  const citizens = await api
    .post<CitizenId[], any>({ url: `citizen/3.0/${MUNICIPALITY_ID}/guid/batch`, data: personalSecurityNumbers }, user)
    .then(res => res.data);
  const validCitizens = citizens.filter(citizen => citizen.personId);

  return validCitizens;
};
export const fetchPersonId = async (user: User, api: ApiService, personalSecurityNumber: string[]): Promise<string> => {
  const personId = await api
    .post<string, any>({ url: `citizen/3.0/${MUNICIPALITY_ID}/${personalSecurityNumber}/guid` }, user)
    .then(res => res.data);
  return personId;
};
export const fetchPersonnummer = async (user: User, api: ApiService, personId: string): Promise<string> => {
  const personnummer = await api
    .get<string>({ url: `citizen/3.0/${MUNICIPALITY_ID}/${personId}/personnumber` }, user)
    .then(res => res.data);
  return personnummer;
};
export const fetchCitizen = async (user: User, api: ApiService, personId: string): Promise<Citizenaddress> => {
  const citizen = await api
    .get<Citizenaddress>({ url: `citizen/3.0/${MUNICIPALITY_ID}/${personId}` }, user)
    .then(res => res.data);
  return citizen;
};
export const fetchPersonIdPersonnummerRecord = async (
  user: User,
  api: ApiService,
  personIds: string[],
): Promise<Record<string, string>> => {
  let personIdPersonnummerPars: Record<string, string> = {};

  const results = await Promise.allSettled(
    personIds.map(async personId => {
      const personnummer = await api.get<string>(
        { url: `citizen/3.0/${MUNICIPALITY_ID}/${personId}/personnumber` },
        user,
      );
      return { personId, personnummer: personnummer.data };
    }),
  );

  for (const result of results) {
    if (result.status === 'fulfilled') {
      const { personId, personnummer } = result.value;
      personIdPersonnummerPars[personId] = personnummer;
    }
  }

  return personIdPersonnummerPars;
};
export const precheckPersonIds = async (
  user: User,
  api: ApiService,
  personIds: string[],
): Promise<RecipientDeliveryMethod[]> => {
  const deliveryMethods = await api
    .post<
      RecipientDeliveryMethods,
      any
    >({ url: `${POSTPORTALSERVICE_PATH}/${MUNICIPALITY_ID}/precheck`, data: { partyIds: [...personIds] }, headers: { 'X-Sent-By': `type=adAccount; ${user.username.toLowerCase()}` } }, user)
    .then(res => res.data?.recipients ?? []);
  return deliveryMethods;
};

interface EligibilityItemDto {
  partyIds: string[];
}
interface EligibilityItemResponseDto {
  partyId: string;
  hasKivra: boolean;
}

export const checkEligibilityKivra = async (
  partyId: string,
  user: RequestWithUser['user'],
): Promise<EligibilityItemResponseDto> => {
  const apiService = new ApiService();
  const data: EligibilityItemDto = { partyIds: [partyId] };
  const url = `${POSTPORTALSERVICE_PATH}/${MUNICIPALITY_ID}/precheck/kivra`;

  try {
    const res = await apiService.post<string[], EligibilityItemDto>({ url, data }, user);
    const hasKivra = res.data.includes(partyId);
    return { partyId, hasKivra };
  } catch (e) {
    const errorMessage = 'Error when checking eligibility';
    console.error(`${errorMessage}:`, e);
    logger.error(`${errorMessage}:`, e);
    throw new Error(errorMessage);
  }
};
