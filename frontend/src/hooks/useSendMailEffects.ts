import { useEffect } from 'react';
import { UseFormSetValue } from 'react-hook-form';
import { useMessageStore } from '@services/recipient-service';
import { SendMailForm } from '@pages/send/mail';

interface UseSendMailEffectsProps {
  setValue: UseFormSetValue<SendMailForm>;
  resetAll: () => void;
  setSuccess: (value: boolean) => void;
}

export const useSendMailEffects = ({ setValue, resetAll, setSuccess }: UseSendMailEffectsProps) => {
  const recipients = useMessageStore((state) => state.recipients);
  const response = useMessageStore((state) => state.response);
  const recResponse = useMessageStore((state) => state.recResponse);

  useEffect(() => {
    if (response || recResponse) {
      setSuccess(true);
      resetAll();
    }
  }, [response, recResponse, resetAll, setSuccess]);

  useEffect(() => {
    setValue('storeRecipients', recipients ?? [], { shouldValidate: false, shouldDirty: false });
  }, [recipients, setValue]);
};
