import { Recipient, RecipientApiResponse } from 'src/data-contracts/backend/data-contracts';

const getReason = (minor?: boolean) => {
  if (minor) {
    return 'INELIGIBLE_MINOR';
  }
  return 'REASON';
};

export const recipient = (
  personnumber: string,
  deliveryMethod: Recipient['deliveryMethod'] = 'SNAIL_MAIL',
  minor?: boolean
): RecipientApiResponse => ({
  data: {
    partyId: `party-${personnumber}`,
    personNumber: personnumber,
    deliveryMethod: deliveryMethod,
    address: {
      firstName: 'Person',
      lastName: 'Personsson',
      street: 'HEMVÄGEN 100',
      zipCode: '123 45',
      city: 'STADEN',
      country: 'SVERIGE',
    },
    reason: deliveryMethod === 'DELIVERY_NOT_POSSIBLE' ? getReason(minor) : undefined,
  },
  message: 'success',
});

export const orgRecipient = (
  orgNumber: string,
  deliveryMethod: Recipient['deliveryMethod'] = 'SNAIL_MAIL'
): RecipientApiResponse => ({
  data: {
    partyId: `party-${orgNumber}`,
    orgNumber: orgNumber,
    deliveryMethod: deliveryMethod,
    address: {
      firstName: '',
      lastName: '',
      organizationName: 'Företaget AB',
      street: 'FÖRETAGSVÄGEN 1',
      zipCode: '123 45',
      city: 'STADEN',
      country: 'SVERIGE',
    },
  },
  message: 'success',
});
