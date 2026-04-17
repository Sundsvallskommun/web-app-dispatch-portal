import { checkCsvSms, MAX_RECIPIENT_FILE_SIZE_MB } from '@services/recipient-service';
import { FileUpload, FormControl } from '@sk-web-gui/react';
import CustomFormErrorMessage from '@components/custom-form-error-message/custom-form-error-message.component';
import { useCsvRecipientFileHandler } from '../hooks/use-csv-file-handler';

export const CsvSmsRecipients: React.FC = () => {
  const { handleFiles, handleError, recipientListError } = useCsvRecipientFileHandler({
    checkCsv: checkCsvSms,
    warningKeys: {
      title: 'send-sms:csvWarning.title',
      duplicates: 'send-sms:csvWarning.duplicates',
      rejections: 'send-sms:csvWarning.rejections',
      description: 'send-sms:csvWarning.description',
      confirm: 'send-sms:csvWarning.confirm',
      cancel: 'send-sms:csvWarning.cancel',
    },
    errorKeys: {
      csvPrefix: 'send-sms:errors.csv',
      csvFetch: 'send-sms:errors.csvFetch',
      badFile: 'send-sms:errors.badFile',
    },
  });

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
        {recipientListError && <CustomFormErrorMessage message={recipientListError.message} />}
      </FormControl>
    </div>
  );
};
