import HandlerWrapper from '@components/handler-wrapper/handler-wrapper.component';
import { ProgressBar, FileUpload, UploadFile } from '@sk-web-gui/react';
import { MAX_ATTACHMENT_FILE_SIZE_MB } from '@utils/file.utils';
import { useEffect, useMemo } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { PdfUploadHandler } from '@components/file-upload/pdf-upload.component';

export interface Attachment {
  file: File | undefined;
}

export interface AttachmentFormModel {
  attachmentList: UploadFile[];
}

const AttachmentHandler: React.FC = () => {
  const { watch, setValue, getValues } = useFormContext<AttachmentFormModel>();
  const attachmentList = watch('attachmentList') ?? [];
  const { t } = useTranslation(['send-mail']);

  useEffect(() => {
    setValue('attachmentList', []);
  }, [setValue]);

  const fileStorageLimit = useMemo(() => {
    const totalBytes = attachmentList.reduce((sum, a) => sum + (a.file?.size || 0), 0);
    return (totalBytes / (1024 * 1024)).toFixed(1);
  }, [attachmentList]);

  const progressBarValues = {
    steps: MAX_ATTACHMENT_FILE_SIZE_MB * 10,
    current: Number(fileStorageLimit) * 10,
  };

  const handleRemove = (file: UploadFile) => {
    const attachments = getValues('attachmentList').filter((a) => a.id !== file.id);
    setValue('attachmentList', attachments);
  };

  return (
    <HandlerWrapper
      title={t('send-mail:attachmentHandler.header')}
      description={t('send-mail:attachmentHandler.description')}
    >
      <div className="w-full flex flex-col">
        <PdfUploadHandler />
        <div className="flex flex-col gap-8 w-full pt-64">
          <p className="text-small">
            {t('send-mail:attachmentHandler.progressStepper', {
              files: fileStorageLimit.replace('.', ','),
              limit: MAX_ATTACHMENT_FILE_SIZE_MB.toString().replace('.', ','),
            })}
          </p>
          <ProgressBar size="md" color="vattjom" steps={progressBarValues.steps} current={progressBarValues.current} />
        </div>
        <div className="w-full pt-40">
          <h3 className="text-label-medium font-sans">{t('send-mail:attachmentHandler.addedFilesHeader')}</h3>
          {attachmentList.length > 0 ? (
            <div className="w-full" data-cy="attachments">
              <p className="text-small">{t('send-mail:attachmentHandler.addedFilesDescription')}</p>
              <FileUpload.List
                files={attachmentList}
                sortable
                actionsProps={{ showRemove: true, onRemove: handleRemove }}
              />
            </div>
          ) : (
            <p className="text-secondary">{`${t('send-mail:attachmentHandler:noFiles')}`}</p>
          )}
        </div>
      </div>
    </HandlerWrapper>
  );
};

export default AttachmentHandler;
