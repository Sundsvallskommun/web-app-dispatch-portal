import { checkCsv, MAX_RECIPIENT_FILE_SIZE_MB } from '@services/recipient-service';
import { FileUpload, FormControl } from '@sk-web-gui/react';
import CustomFormErrorMessage from '@components/custom-form-error-message/custom-form-error-message.component';
import { useCsvRecipientFileHandler } from '../hooks/use-csv-file-handler';

export const CsvRecipients: React.FC = () => {
  const { handleFiles, handleError, recipientListError } = useCsvRecipientFileHandler({
    checkCsv,
    warningKeys: {
      title: 'send-mail:recipientHandler.csvWarning.title',
      rejections: 'send-mail:recipientHandler.csvWarning.rejections',
      description: 'send-mail:recipientHandler.csvWarning.description',
      confirm: 'send-mail:recipientHandler.csvWarning.confirm',
      cancel: 'send-mail:recipientHandler.csvWarning.cancel',
    },
    errorKeys: {
      csvPrefix: 'send-mail:recipientHandler.errorHandler.csv',
      csvFetch: 'send-mail:recipientHandler.fetchRecipientError.csvFile',
      badFile: 'send-mail:recipientHandler.errorHandler.badFile',
    },
  });

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
        {recipientListError && <CustomFormErrorMessage message={recipientListError.message} />}
      </FormControl>
    </div>
  );
};
