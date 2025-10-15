import { useCallback } from 'react';
import { FieldValues, Path, UseFormSetError, UseFormTrigger } from 'react-hook-form';
import { handleStepValidation } from '../utils/handleStepValidation';

export interface UseStepValidationArgs<T extends FieldValues> {
  trigger: UseFormTrigger<T>;
  setError: UseFormSetError<T>;
  fieldsToValidate: Path<T>[];
  condition: boolean;
  errorField: Path<T>;
  errorMessage: string;
}

export const useStepValidation = <T extends FieldValues>({
  trigger,
  setError,
  fieldsToValidate,
  condition,
  errorField,
  errorMessage,
}: UseStepValidationArgs<T>) => {
  return useCallback(async () => {
    return handleStepValidation<T>({
      trigger,
      setError,
      fieldsToValidate,
      condition,
      errorField,
      errorMessage,
    });
  }, [trigger, setError, fieldsToValidate, condition, errorField, errorMessage]);
};
