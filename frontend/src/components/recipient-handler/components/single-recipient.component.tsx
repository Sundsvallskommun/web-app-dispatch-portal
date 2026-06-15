import { getOrgRecipient, getRecipient, useMessageStore } from '@services/recipient-service';
import { FormControl, FormLabel, SearchField, Spinner, useConfirm } from '@sk-web-gui/react';
import React, { KeyboardEvent, useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { formSendType } from 'src/constants';
import { Recipient } from 'src/data-contracts/backend/data-contracts';
import { SendType } from 'src/types';
import { RecipientListFormModel } from '../recipient-handler';
import PreviewRecipient from './preview-recipient.component';
import CustomFormErrorMessage from '@components/custom-form-error-message/custom-form-error-message.component';

interface SingleRecipientProps {
  sendType: SendType;
}

export const SingleRecipient: React.FC<SingleRecipientProps> = ({ sendType }) => {
  const [error, setError] = useState<string | undefined>(undefined);
  const [foundRecipient, setFoundRecipient] = useState<Recipient | undefined>(undefined);
  const [isLoadingRecipients, setIsLoadingRecipients] = useState(false);
  const { recipients, setRecipients } = useMessageStore();
  const confirm = useConfirm();
  const [value, setValue] = useState<string>('');
  const { t } = useTranslation();
  const digits = value.replace(/\D/g, '');

  const {
    clearErrors,
    formState: { errors },
  } = useFormContext<RecipientListFormModel>();

  const isRek = sendType === formSendType.REK_MAIL;

  const renderFormMessage = () => {
    if (errors.storeRecipients?.message) {
      return <CustomFormErrorMessage message={errors.storeRecipients.message} />;
    } else if (error) {
      return <CustomFormErrorMessage message={error} />;
    } else {
      return (
        <p className="text-small">
          {t(`send-mail:recipientHandler.searchIdentity${isRek ? 'NumberHelperRek' : 'NumberHelper'}`)}
        </p>
      );
    }
  };

  const fetchRecipient = () => {
    setIsLoadingRecipients(true);
    setError(undefined);

    const isCitizen = digits.length === 12;

    (isCitizen ? getRecipient(digits, isRek) : getOrgRecipient(digits))
      .then((res) => {
        const alreadyExists = recipients.find((rec) => rec?.partyId === res?.partyId);
        if (alreadyExists) {
          setError(t('send-mail:recipientHandler.fetchRecipientError.alreadyExists'));
          return;
        }
        setFoundRecipient(res);
        setError(undefined);
      })
      .catch(() => {
        setIsLoadingRecipients(false);
        setFoundRecipient(undefined);
        setError(t('send-mail:recipientHandler.fetchRecipientError.singleRecipient'));
      })
      .finally(() => setIsLoadingRecipients(false));
  };

  useEffect(() => {
    const readyToFetch = isRek ? digits.length === 12 : digits.length === 10 || digits.length === 12;
    if (!readyToFetch) {
      return;
    }
    const timeout = setTimeout(() => fetchRecipient(), 300);
    return () => clearTimeout(timeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  const handleSubmitSingleRecipient = () => {
    if (!foundRecipient) {
      if (value.length < 10) {
        setError(t('send-mail:recipientHandler.personalNumberError.fewNumber'));
      } else if (value.length > 13) {
        setError(t('send-mail:recipientHandler.personalNumberError.tooManyNumbers'));
      }
      return;
    }
    if (foundRecipient?.deliveryMethod === 'DELIVERY_NOT_POSSIBLE') return;

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
            setRecipients([foundRecipient]);
          }
          setFoundRecipient(undefined);
          setValue('');
        });
    } else {
      setRecipients(recipients.concat(foundRecipient));
      setFoundRecipient(undefined);
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
    <FormControl className="w-full" invalid={!!error}>
      <div className="flex flex-col w-full gap-8 pb-24">
        <FormLabel>
          {t(
            isRek
              ? 'send-mail:recipientHandler.searchIdentityNumberRek'
              : 'send-mail:recipientHandler.searchIdentityNumber'
          )}
        </FormLabel>
        <SearchField
          data-cy="recipient-search-field"
          onChange={(e) => setValue(e.target.value)}
          value={value}
          size="md"
          maxLength={13}
          minLength={10}
          placeholder="Sök"
          showSearchButton={false}
          onKeyDown={handleEnter}
          onReset={() => {
            setValue('');
            setError(undefined);
            setFoundRecipient(undefined);
          }}
        />
        {renderFormMessage()}

        {isLoadingRecipients ? (
          <div className="my-md flex flex-col items-center">
            <Spinner size={2.4} />
            <p>{t('send-mail:recipientHandler.fetchingRecipient')}</p>
          </div>
        ) : null}

        <PreviewRecipient
          loading={isLoadingRecipients}
          recipient={foundRecipient}
          handleSubmit={handleSubmitSingleRecipient}
          sendType={sendType}
          searchValue={value}
        />
      </div>
    </FormControl>
  );
};
