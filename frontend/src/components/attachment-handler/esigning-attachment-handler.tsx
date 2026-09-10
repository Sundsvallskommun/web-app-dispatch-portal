import CustomFormErrorMessage from '@components/custom-form-error-message/custom-form-error-message.component';
import { usePdfFileHandler } from '@components/file-upload/hooks/use-pdf-file-handler';
import HandlerWrapper from '@components/handler-wrapper/handler-wrapper.component';
import { Divider, FileUpload, FormControl, FormLabel, Icon, Input, ProgressBar, UploadFile } from '@sk-web-gui/react';
import { MAX_ESIGNING_ATTACHMENTS, MAX_ESIGNING_TOTAL_SIZE_MB } from '@utils/file.utils';
import { File, Pencil } from 'lucide-react';
import { useTranslation } from 'next-i18next';
import { useFormContext } from 'react-hook-form';
import { useEsigningDocuments } from 'src/hooks/useEsigningDocuments';
import { DocumentTypeLabel } from '@components/file-upload/document-type-label.component';

interface EsigningAttachmentFormModel {
  subject: string;
  signatoryDocument: UploadFile[];
  attachmentList: UploadFile[];
}

const bytesOf = (files: UploadFile[] = []) => files.reduce((sum, item) => sum + (item.file?.size ?? 0), 0);

const errorKeys = {
  badFile: 'send-esigning:attachmentHandler.errors.wrongFileType',
  totalSize: 'send-esigning:attachmentHandler.errors.totalSize',
  duplicateFileName: 'send-esigning:attachmentHandler.errors.duplicateFileName',
  emptyFile: 'send-esigning:attachmentHandler.errors.emptyFile',
  maxNumberFiles: 'send-esigning:attachmentHandler.errors.maxNumberFiles',
};

const EsigningAttachmentHandler = () => {
  const { t } = useTranslation(['send-esigning', 'common']);
  const {
    register,
    setValue,
    getValues,
    formState: { errors },
  } = useFormContext<EsigningAttachmentFormModel>();

  const { signatoryDocument, attachmentList, combinedDocumentList, isSignatoryDocument, fileSizeDescription } =
    useEsigningDocuments();

  const documentBytes = bytesOf(signatoryDocument);
  const attachmentBytes = bytesOf(attachmentList);

  const documentUpload = usePdfFileHandler({
    errorKeys,
    maxFileSizeMB: MAX_ESIGNING_TOTAL_SIZE_MB,
    maxFiles: 1,
    fieldName: 'signatoryDocument',
    usedBytesElsewhere: attachmentBytes,
  });

  const attachmentUpload = usePdfFileHandler({
    errorKeys,
    maxFileSizeMB: MAX_ESIGNING_TOTAL_SIZE_MB,
    maxFiles: MAX_ESIGNING_ATTACHMENTS,
    fieldName: 'attachmentList',
    usedBytesElsewhere: documentBytes,
  });

  const usedMB = ((documentBytes + attachmentBytes) / (1024 * 1024)).toFixed(1);

  const handleRemove = (file: UploadFile) => {
    const field = isSignatoryDocument(file) ? 'signatoryDocument' : 'attachmentList';

    setValue(
      field,
      (getValues(field) ?? []).filter((item) => item.id !== file.id),
      { shouldValidate: true, shouldDirty: true }
    );
  };

  return (
    <div className="w-full flex justify-center">
      <HandlerWrapper title={t('send-esigning:attachmentHandler.title')}>
        <FormControl className="w-full mt-[-38px]" size="md">
          <FormLabel className="sr-only">{t('send-esigning:attachmentHandler.title')}</FormLabel>
          <p className="text-secondary">{t('send-esigning:attachmentHandler.subjectDescription')}</p>
          <Input
            invalid={!!errors?.subject}
            data-cy="esigning-subject"
            className="max-w-[500px]"
            {...register('subject')}
            placeholder={t('send-esigning:attachmentHandler.subjectPlaceholder')}
          />
          {errors?.subject && <CustomFormErrorMessage message={errors.subject.message?.toString()} />}
        </FormControl>

        <div className="w-full flex flex-col gap-8">
          <Divider className="mb-30" />
          <h3 className="text-label-medium">{t('send-esigning:attachmentHandler.signingDocumentLabel')}</h3>
          <p className="text-secondary">{t('send-esigning:attachmentHandler.signingDocumentDescription')}</p>
          <FormControl id="signatoryDocument" className="w-full">
            <FileUpload.Field
              className="w-full pt-8"
              name="signatoryDocument"
              data-cy="signing-document-input"
              maxFileSizeMB={MAX_ESIGNING_TOTAL_SIZE_MB}
              accept={['application/pdf']}
              onChange={documentUpload.handleFiles}
              onInvalid={documentUpload.handleError}
              allowMultiple={false}
              appendToContext={false}
            />
            {documentUpload.pdfError && (
              <CustomFormErrorMessage message={documentUpload.pdfError.message?.toString()} />
            )}
            {!documentUpload.pdfError && errors?.signatoryDocument && (
              <CustomFormErrorMessage message={errors.signatoryDocument.message?.toString()} />
            )}
          </FormControl>
        </div>

        <div className="w-full flex flex-col gap-8">
          <h3 className="text-label-medium">{t('send-esigning:attachmentHandler.attachmentsLabel')}</h3>
          <p className="text-secondary">{t('send-esigning:attachmentHandler.attachmentsDescription')}</p>
          <FormControl id="attachmentList" className="w-full">
            <FileUpload.Field
              className="w-full pt-8"
              name="attachmentList"
              data-cy="attachment-input"
              maxFileSizeMB={MAX_ESIGNING_TOTAL_SIZE_MB}
              accept={['application/pdf']}
              onChange={attachmentUpload.handleFiles}
              onInvalid={attachmentUpload.handleError}
              allowMultiple={true}
              appendToContext={false}
            />
            {attachmentUpload.pdfError && (
              <CustomFormErrorMessage message={attachmentUpload.pdfError.message?.toString()} />
            )}
          </FormControl>
        </div>

        <div className="w-full flex flex-col gap-8">
          <p className="text-small" data-cy="used-space">
            {t('send-esigning:attachmentHandler.usedSpace', {
              files: usedMB.replace('.', ','),
              limit: MAX_ESIGNING_TOTAL_SIZE_MB.toString().replace('.', ','),
            })}
          </p>
          <ProgressBar
            size="md"
            color="vattjom"
            steps={MAX_ESIGNING_TOTAL_SIZE_MB * 10}
            current={Number(usedMB) * 10}
          />
        </div>
        <div className="w-full flex flex-col gap-8">
          <h3 className="text-label-medium">{t('send-esigning:attachmentHandler.attachmentListLabel')}</h3>
          {combinedDocumentList.length === 0 && <p>{t('send-esigning:attachmentHandler.noAttachments')}</p>}
          {combinedDocumentList.length > 0 && (
            <div data-cy="combined-document-list">
              <FileUpload.List files={combinedDocumentList} showIcon={true}>
                {combinedDocumentList.map((file, index) => (
                  <FileUpload.ListItem
                    key={file.id}
                    index={index}
                    file={file}
                    iconProps={{ icon: <Icon icon={isSignatoryDocument(file) ? <Pencil /> : <File />} /> }}
                    nameProps={{ description: fileSizeDescription(file) }}
                    actionsProps={{
                      showRemove: true,
                      onRemove: handleRemove,
                      extraActions: <DocumentTypeLabel isSignatoryDocument={isSignatoryDocument(file)} />,
                    }}
                  />
                ))}
              </FileUpload.List>
            </div>
          )}
        </div>
      </HandlerWrapper>
    </div>
  );
};

export default EsigningAttachmentHandler;
