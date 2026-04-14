import { checkCsvSms, MAX_RECIPIENT_FILE_SIZE_MB } from '@services/recipient-service';
import { CustomOnChangeEventUploadFile, FileUpload, FormControl, useConfirm } from '@sk-web-gui/react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import CustomFormErrorMessage from '@components/custom-form-error-message/custom-form-error-message.component';
import { Attachment } from '@components/attachment-handler/attachment-handler';
import { Csv } from 'src/data-contracts/backend/data-contracts';

interface CsvSmsFormModel {
  recipientList: Array<Csv & Attachment>;
}

export const CsvSmsRecipients: React.FC = () => {
  const { showConfirmation } = useConfirm();
  const { t } = useTranslation();
  const {
    setError,
    setValue,
    clearErrors,
    formState: { errors },
  } = useFormContext<CsvSmsFormModel>();

  const handleFiles = async (event: CustomOnChangeEventUploadFile) => {
    const files = event.target.value;
    if (!files?.[0]) return;
    try {
      const csvData = await checkCsvSms(files[0].file);
      if (csvData.status === 'OK') {
        const countDuplicates = Object.keys(csvData.duplicateEntries ?? {}).length;
        const countRejections = (csvData.rejectedEntries ?? []).length;
        if (countDuplicates > 0 || countRejections > 0) {
          const message = (
            <>
              {countDuplicates > 0 ? (
                <p>{t('send-sms:csvWarning.duplicates', { count: countDuplicates })}</p>
              ) : (
                <></>
              )}
              {countRejections > 0 ? (
                <p>{t('send-sms:csvWarning.rejections', { count: countRejections })}</p>
              ) : (
                <></>
              )}
              <p>{t('send-sms:csvWarning.description')}</p>
            </>
          );

          showConfirmation(
            t('send-sms:csvWarning.title'),
            message,
            t('send-sms:csvWarning.confirm'),
            t('send-sms:csvWarning.cancel'),
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
          message: `send-sms:errors.csv.${csvData.error ?? 'UNKNOWN'}`,
        });
      }
    } catch {
      setError('recipientList', { message: 'send-sms:errors.csvFetch' });
    }
  };

  const handleError = () => {
    setError('recipientList', { message: 'send-sms:errors.badFile' });
  };

  return (
    <div className="flex flex-col gap-32 w-full">
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
