import { FieldValues, Path, UseFormSetError, UseFormTrigger } from 'react-hook-form';

export interface ValidationHandlerArgs<T extends FieldValues> {
  trigger: UseFormTrigger<T>;
  setError: UseFormSetError<T>;
  fieldsToValidate: Path<T>[];
  condition: boolean;
  errorField: Path<T>;
  errorMessage: string;
}

export const handleStepValidation = async <T extends FieldValues>({
  trigger,
  setError,
  fieldsToValidate,
  condition,
  errorField,
  errorMessage,
}: ValidationHandlerArgs<T>): Promise<boolean> => {
  const isValid = await trigger(fieldsToValidate);

  if (!condition && isValid) {
    setError(errorField, {
      type: 'manual',
      message: errorMessage,
    });
    return false;
  }

  return isValid;
};
