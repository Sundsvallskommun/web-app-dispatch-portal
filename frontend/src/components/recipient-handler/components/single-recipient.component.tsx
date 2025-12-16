import { getRecipient, useMessageStore } from '@services/recipient-service';
import { FormControl, FormLabel, SearchField, useConfirm, useSnackbar } from '@sk-web-gui/react';
import { KeyboardEvent, useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { formSendType } from 'src/constants';
import { Recipient } from 'src/data-contracts/backend/data-contracts';
import { SendType } from 'src/types';
import { RecipientListFormModel } from '../recipient-handler';
import PreviewPerson from './preview-person.component';
import CustomFormErrorMessage from '@components/custom-form-error-message/custom-form-error-message.component';

interface SingleRecipientProps {
  sendType: SendType;
}

export const SingleRecipient: React.FC<SingleRecipientProps> = ({ sendType }) => {
  const [error, setError] = useState<string | undefined>(undefined);
  const [foundPerson, setFoundPerson] = useState<Recipient | undefined>(undefined);
  const [isLoadingRecipients, setIsLoadingRecipients] = useState(false);
  const { recipients, setRecipients } = useMessageStore();
  const snackbar = useSnackbar();
  const confirm = useConfirm();
  const [value, setValue] = useState<string>('');
  const { t } = useTranslation();

  const {
    clearErrors,
    formState: { errors },
  } = useFormContext<RecipientListFormModel>();

  const renderFormMessage = () => {
    if (errors.storeRecipients?.message) {
      return <CustomFormErrorMessage padded={false} message={errors.storeRecipients.message} />;
    } else if (error) {
      return <CustomFormErrorMessage padded={false} message={error} />;
    } else {
      return <p className="text-small">{t('send-mail:recipientHandler.searchPersonalNumberHelper')}</p>;
    }
  };

  const fetchRecipient = () => {
    setIsLoadingRecipients(true);
    setError(undefined);
    getRecipient(value.replace('-', '').replace(' ', ''), sendType === formSendType.REK_MAIL)
      .then((res) => {
        // check for duplicates
        const alreadyExists = recipients.find((rec) => rec?.partyId === res?.partyId);
        if (alreadyExists) {
          setError(t('send-mail:recipientHandler.fetchRecipientError.alreadyExists'));
          return;
        }
        setFoundPerson(res);
        setError(undefined);
      })
      .catch(() => {
        snackbar({ message: t('send-mail:recipientHandler.fetchRecipientError.singleRecipient'), status: 'error' });
        setIsLoadingRecipients(false);
        setError(t('send-mail:recipientHandler.fetchRecipientError.singleRecipient'));
      })
      .finally(() => setIsLoadingRecipients(false));
  };

  useEffect(() => {
    if (value && value?.replace('-', '').length === 12) {
      fetchRecipient();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const handleSubmitSingleRecipient = () => {
    if (!foundPerson) {
      if (value.length < 12) {
        setError(t('send-mail:recipientHandler.personalNumberError.fewNumber'));
      } else if (value.length > 13) {
        setError(t('send-mail:recipientHandler.personalNumberError.tooManyNumbers'));
      }
      return;
    }
    if (foundPerson?.deliveryMethod === 'DELIVERY_NOT_POSSIBLE') return;

    if (sendType === formSendType.REK_MAIL && recipients.length > 0) {
      confirm
        .showConfirmation(
          t('send-mail:recipientHandler.rekMail.replaceRecipientConfirm.title'),
          t('send-mail:recipientHandler.rekMail.replaceRecipientConfirm.message'),
          t('send-mail:recipientHandler.rekMail.replaceRecipientConfirm.confirm'),
          t('send-mail:recipientHandler.rekMail.replaceRecipientConfirm.dismiss'),
          'info'
        )
        .then((confirm: boolean) => {
          if (confirm) {
            setRecipients([foundPerson]);
          }
          setFoundPerson(undefined);
          setValue('');
        });
    } else {
      setRecipients(recipients.concat(foundPerson));
      setFoundPerson(undefined);
      clearErrors('storeRecipients');
      setValue('');
      setError(undefined);
    }
  };

  const handleEnter = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      handleSubmitSingleRecipient();
    }
  };

  return (
    <FormControl className="relative w-full medium-device:w-[365px]" invalid={!!error}>
      <div className="flex flex-col w-full gap-8 pb-24">
        <FormLabel>{t('send-mail:recipientHandler.searchPersonalNumber')}</FormLabel>
        <SearchField
          data-cy="person-search-field"
          onChange={(e) => setValue(e.target.value)}
          value={value}
          className="w-full"
          showResetButton={value.length > 0}
          type="text"
          size="md"
          maxLength={13}
          minLength={12}
          placeholder="Sök"
          showSearchButton={false}
          onKeyDown={handleEnter}
          onReset={() => {
            setValue('');
            setError(undefined);
            setFoundPerson(undefined);
          }}
        />
        {renderFormMessage()}

        <PreviewPerson
          loading={isLoadingRecipients}
          person={foundPerson}
          handleSubmit={handleSubmitSingleRecipient}
          sendType={sendType}
        />
      </div>
    </FormControl>
  );
};
