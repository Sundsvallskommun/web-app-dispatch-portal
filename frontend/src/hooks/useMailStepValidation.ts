import { useStepValidation } from './useStepValidation';
import { UseFormSetError, UseFormTrigger } from 'react-hook-form';
import { useTranslation } from 'next-i18next';
import { useMessageStore } from '@services/recipient-service';
import { SendMailForm } from '@pages/send/mail';

export const useMailStepValidations = (
  trigger: UseFormTrigger<SendMailForm>,
  setError: UseFormSetError<SendMailForm>,
  hasAtLeastOneAttachment: boolean
) => {
  const { t } = useTranslation(['send-mail']);
  const recipients = useMessageStore((state) => state.recipients);

  const recipientOnNextClick = useStepValidation<SendMailForm>({
    trigger,
    setError,
    fieldsToValidate: ['singleRecipient', 'recipientList', 'storeRecipients'],
    condition: !!recipients?.length,
    errorField: 'storeRecipients',
    errorMessage: t('send-mail:recipientHandler:errorHandler.singleRecipientError'),
  });

  const filesOnNextClick = useStepValidation<SendMailForm>({
    trigger,
    setError,
    fieldsToValidate: ['attachmentList'],
    condition: hasAtLeastOneAttachment,
    errorField: 'attachmentList',
    errorMessage: t('send-mail:attachmentHandler.errorMessage', 'Du måste bifoga minst ett dokument.'),
  });

  return { recipientOnNextClick, filesOnNextClick };
};
