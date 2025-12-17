import { AddWithAddressDialog } from '@components/add-with-address-dialog/add-with-address-dialog.component';
import { useMessageStore } from '@services/recipient-service';
import { Button, FormControl, Icon, useSnackbar } from '@sk-web-gui/react';
import { Plus } from 'lucide-react';
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { formSendType } from 'src/constants';
import { Address, Recipient } from 'src/data-contracts/backend/data-contracts';
import { SendType } from 'src/types';
import { useShallow } from 'zustand/shallow';
import { RecipientListFormModel } from '../recipient-handler';

interface SingleAddressProps {
  sendType: SendType;
}

export const SingleAddress: React.FC<SingleAddressProps> = ({ sendType }) => {
  const [isAddWithAddressOpen, setIsAddWithAddressOpen] = useState(false);
  const { clearErrors } = useFormContext<RecipientListFormModel>();
  const snackbar = useSnackbar();

  const [setAddresses, addresses] = useMessageStore(useShallow((state) => [state.setAddresses, state.addresses]));
  const { t } = useTranslation();

  const handleCloseAddWithAddressDialog = (closeData: Address | undefined) => {
    if (closeData) {
      const newAdress: Partial<Recipient> = {
        deliveryMethod: 'SNAIL_MAIL',
        address: closeData,
      };
      // find duplicates
      const alreadyExists = addresses.some(
        (recipient) =>
          recipient?.address === newAdress?.address &&
          recipient?.address?.firstName === newAdress?.address?.firstName &&
          recipient?.address?.lastName === newAdress?.address?.lastName &&
          recipient?.address?.zipCode === newAdress?.address?.zipCode &&
          recipient?.address?.city === newAdress?.address?.city &&
          recipient?.address?.careOf === newAdress?.address?.careOf
      );

      if (alreadyExists) {
        snackbar({ message: t('send-mail:recipientHandler.fetchRecipientError.alreadyExists'), status: 'warning' });
        setIsAddWithAddressOpen(false);
        return;
      }
      clearErrors('storeRecipients');
      setAddresses(addresses.concat(newAdress));
    }
    setIsAddWithAddressOpen(false);
  };

  return (
    <FormControl>
      {sendType === formSendType.MAIL && (
        <div className="my-32">
          <AddWithAddressDialog open={isAddWithAddressOpen} onClose={handleCloseAddWithAddressDialog} />
          <p className="font-bold">{t('send-mail:recipientHandler.missingPersonalNumber')}</p>
          <Button
            data-cy="add-with-address-button"
            leftIcon={<Icon icon={<Plus />} />}
            onClick={() => setIsAddWithAddressOpen(true)}
            color="vattjom"
            inverted
          >
            {t('send-mail:recipientHandler.addRecipientWithAddress')}
          </Button>
        </div>
      )}
    </FormControl>
  );
};
