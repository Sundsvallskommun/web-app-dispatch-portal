import { FileUpload, FormControl } from '@sk-web-gui/react';
import CustomFormErrorMessage from '@components/custom-form-error-message/custom-form-error-message.component';
import { usePdfFileHandler } from '@components/file-upload/hooks/use-pdf-file-handler';
import { MAX_ATTACHMENT_FILE_SIZE_MB } from '@utils/file.utils';

export const PdfUploadHandler: React.FC = () => {
  const { handleFiles, handleError, pdfError } = usePdfFileHandler({
    maxFileSizeMB: MAX_ATTACHMENT_FILE_SIZE_MB,
    maxFiles: 4,
    errorKeys: {
      badFile: 'send-mail:attachmentHandler.validation.wrongFileType',
      totalSize: 'send-mail:attachmentHandler.validation.totalSize',
      duplicateFileName: 'send-mail:attachmentHandler.validation.duplicateFileName',
      emptyFile: 'send-mail:attachmentHandler.validation.emptyFile',
      maxNumberFiles: 'send-mail:attachmentHandler.validation.maxNumberFiles',
    },
  });

  return (
    <div className="flex flex-col gap-32 w-full">
      <FormControl id="attachment" className="w-full">
        <FileUpload.Field
          className="w-full"
          data-cy="file-input"
          maxFileSizeMB={MAX_ATTACHMENT_FILE_SIZE_MB}
          accept={['application/pdf']}
          onChange={handleFiles}
          onInvalid={handleError}
          allowMultiple={true}
        />
        {pdfError && <CustomFormErrorMessage message={pdfError.message} />}
      </FormControl>
    </div>
  );
};
