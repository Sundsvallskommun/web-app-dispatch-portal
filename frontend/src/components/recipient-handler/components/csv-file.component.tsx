import { checkCsv, MAX_RECIPIENT_FILE_SIZE_MB } from '@services/recipient-service';
import { CustomOnChangeEventUploadFile, FileUpload, FormControl, useConfirm } from '@sk-web-gui/react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { RecipientListFormModel } from '../recipient-handler';
import CustomFormErrorMessage from '@components/custom-form-error-message/custom-form-error-message.component';

export const CsvRecipients: React.FC = () => {
  const { showConfirmation } = useConfirm();
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
        const countDuplicates = Object.keys(csvData.duplicateEntries ?? {}).length;
        const countRejections = (csvData.rejectedEntries ?? []).length;
        if (countDuplicates > 0 || countRejections > 0) {
          const message = (
            <>
              {countDuplicates > 0 ? (
                <p>{t('send-mail:recipientHandler.csvWarning.duplicates', { count: countDuplicates })}</p>
              ) : (
                <></>
              )}
              {countRejections > 0 ? (
                <p>{t('send-mail:recipientHandler.csvWarning.rejections', { count: countRejections })}</p>
              ) : (
                <></>
              )}
              <p>{t('send-mail:recipientHandler.csvWarning.description')}</p>
            </>
          );

          showConfirmation(
            t('send-mail:recipientHandler.csvWarning.title'),
            message,
            t('send-mail:recipientHandler.csvWarning.confirm'),
            t('send-mail:recipientHandler.csvWarning.cancel'),
            'warning'
          ).then((confirm) => {
            if (confirm) {
              setValue('recipientList', [{ ...csvData, file: files[0].file }]);
            } else {
              setValue('recipientList', []);
            }
          });
        } else {
          setValue('recipientList', [{ ...csvData, file: files[0].file }]);
        }
        clearErrors('recipientList');
      } else {
        setValue('recipientList', []);
        setError('recipientList', {
          message: `send-mail:recipientHandler.errorHandler.csv.${csvData.error ?? 'UNKNOWN'}`,
        });
      }
    } catch {
      setError('recipientList', { message: 'send-mail:recipientHandler.fetchRecipientError.csvFile' });
    }
  };

  const handleError = () => {
    setError('recipientList', { message: 'send-mail:recipientHandler.errorHandler.badFile' });
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
