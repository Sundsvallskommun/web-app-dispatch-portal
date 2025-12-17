import { Recipient, RecipientApiResponse } from 'src/data-contracts/backend/data-contracts';

export const recipient = (
  personnumber: string,
  deliveryMethod: Recipient['deliveryMethod'] = 'SNAIL_MAIL'
): RecipientApiResponse => ({
  data: {
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
    reason: deliveryMethod === 'DELIVERY_NOT_POSSIBLE' ? 'En anledning' : undefined,
  },
  message: 'success',
});
