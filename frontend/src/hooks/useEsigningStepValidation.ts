import { UseFormClearErrors, UseFormTrigger } from 'react-hook-form';
import { SendEsigningForm } from '@utils/esigningFormSchema.yup';
import { useCallback } from 'react';

export const useEsigningStepValidation = (
  clearErrors: UseFormClearErrors<SendEsigningForm>,
  trigger: UseFormTrigger<SendEsigningForm>,
  triggerNames: (keyof SendEsigningForm)[]
) => {
  const onNextClick = useCallback(async () => {
    clearErrors();
    const isValid = await trigger(triggerNames);
    return isValid;
  }, [trigger, clearErrors, triggerNames]);

  return onNextClick;
};
