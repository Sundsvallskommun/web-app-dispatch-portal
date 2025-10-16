import { UseFormClearErrors, UseFormTrigger } from 'react-hook-form';
import { SendMailForm } from '@pages/send/mail';
import { useCallback } from 'react';

export const useMailStepValidation = (
  clearErrors: UseFormClearErrors<SendMailForm>,
  trigger: UseFormTrigger<SendMailForm>,
  triggerNames: (keyof SendMailForm)[]
) => {
  const onNextClick = useCallback(async () => {
    clearErrors();
    const isValid = await trigger(triggerNames);
    return isValid;
  }, [trigger, clearErrors, triggerNames]);

  return onNextClick;
};
