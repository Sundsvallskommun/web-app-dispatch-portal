import { checkCsv, MAX_RECIPIENT_FILE_SIZE_MB } from '@services/recipient-service';
import { CustomOnChangeEventUploadFile, FileUpload, FormControl } from '@sk-web-gui/react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { RecipientListFormModel } from '../recipient-handler';
import CustomFormErrorMessage from '@components/custom-form-error-message/custom-form-error-message.component';

export const CsvRecipients: React.FC = () => {
  const { t } = useTranslation();
  const {
    setError,
    setValue,
    clearErrors,
    formState: { errors },
  } = useFormContext<RecipientListFormModel>();

  const handleFiles = async (event: CustomOnChangeEventUploadFile) => {
    const files = event.target.value;
    if (!files?.[0]) return;
    try {
      const csvData = await checkCsv(files[0].file);
      if (csvData.status === 'OK') {
        setValue('recipientList', [{ ...csvData, file: files[0].file }]);
        clearErrors('recipientList');
      } else {
        setError('recipientList', { message: t('send-mail:recipientHandler.errorHandler.badCsvFile') });
      }
    } catch {
      setError('recipientList', { message: t('send-mail:recipientHandler.fetchRecipientError.csvFile') });
    }
  };

  const handleError = () => {
    setError('recipientList', { message: t('send-mail:recipientHandler..errorHandler.badFile') });
  };

  return (
    <div className="flex flex-col gap-32 w-full pt-32">
      <FormControl id="attachment" className="w-full">
        <FileUpload.Field
          className="w-full"
          data-cy="csv-input"
          maxFileSizeMB={MAX_RECIPIENT_FILE_SIZE_MB}
          accept={['text/csv']}
          onChange={handleFiles}
          onInvalid={handleError}
          allowMultiple={false}
        />
        {errors?.recipientList && <CustomFormErrorMessage message={errors.recipientList.message} />}
      </FormControl>
    </div>
  );
};
