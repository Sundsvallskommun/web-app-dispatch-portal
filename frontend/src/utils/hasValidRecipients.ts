import { AddWithAddress, RecipientWithAddress } from '@services/recipient-service';

export const hasValidRecipients = (recipients: RecipientWithAddress[], addresses: AddWithAddress[]) => {
  return (
    recipients?.some(
      (recipient) => recipient.address && recipient?.address?.addresses?.length > 0 && !recipient.error
    ) || addresses.length > 0
  );
};
