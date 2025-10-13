import { useCallback } from 'react';
import { FieldValues, Path, UseFormTrigger, UseFormSetError } from 'react-hook-form';
import { useTranslation } from 'next-i18next';
import { handleStepValidation } from './handleStepValidation';

export const useFilesOnNextClick = <T extends FieldValues>({
  trigger,
  setError,
  hasAtLeastOneAttachment,
  fieldName,
}: {
  trigger: UseFormTrigger<T>;
  setError: UseFormSetError<T>;
  hasAtLeastOneAttachment: boolean;
  fieldName?: Path<T>;
}) => {
  const { t } = useTranslation(['send-mail']);
  const safeFieldName = fieldName ?? ('attachmentList' as Path<T>);

  return useCallback(async () => {
    return handleStepValidation<T>({
      trigger,
      setError,
      fieldsToValidate: [safeFieldName],
      condition: hasAtLeastOneAttachment,
      errorField: safeFieldName,
      errorMessage: t('send-mail:attachmentHandler.errorMessage', 'Du måste bifoga minst ett dokument.'),
    });
  }, [trigger, setError, hasAtLeastOneAttachment, safeFieldName, t]);
};
