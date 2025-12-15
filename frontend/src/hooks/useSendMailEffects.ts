import { useEffect } from 'react';
import { UseFormSetValue } from 'react-hook-form';
import { useMessageStore } from '@services/recipient-service';
import { SendMailForm } from '@pages/send/mail';
import { useShallow } from 'zustand/shallow';
interface UseSendMailEffectsProps {
  setValue: UseFormSetValue<SendMailForm>;
  resetAll: () => void;
  setSuccess: (value: boolean) => void;
}

export const useSendMailEffects = ({ setValue, resetAll, setSuccess }: UseSendMailEffectsProps) => {
  const [recipients, addresses] = useMessageStore(useShallow((state) => [state.recipients, state.addresses]));
  const response = useMessageStore((state) => state.response);

  useEffect(() => {
    if (response) {
      setSuccess(true);
      resetAll();
    }
  }, [response, resetAll, setSuccess]);

  useEffect(() => {
    setValue('storeRecipients', [...(recipients ?? []), ...(addresses ?? [])], {
      shouldValidate: false,
      shouldDirty: false,
    });
  }, [recipients, addresses, setValue]);
};
