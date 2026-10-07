import { UploadFile } from '@sk-web-gui/react';
import { toFileSizeParts } from '@utils/file.utils';
import { useTranslation } from 'next-i18next';
import { useFormContext } from 'react-hook-form';

interface EsigningDocumentFormModel {
  signatoryDocument: UploadFile[];
  attachmentList: UploadFile[];
}

export const useEsigningDocuments = () => {
  const { t } = useTranslation(['send-esigning']);
  const { watch } = useFormContext<EsigningDocumentFormModel>();

  const signatoryDocument = watch('signatoryDocument') ?? [];
  const attachmentList = watch('attachmentList') ?? [];

  const combinedDocumentList = [...signatoryDocument, ...attachmentList];

  const isSignatoryDocument = (file: UploadFile) => signatoryDocument.some((item) => item.id === file.id);

  const fileSizeDescription = (file: UploadFile) => {
    const { size, unit } = toFileSizeParts(file.file?.size);

    return unit === 'mb'
      ? t('send-esigning:attachmentHandler.fileSizeMb', { size })
      : t('send-esigning:attachmentHandler.fileSizeKb', { size });
  };

  return {
    signatoryDocument,
    attachmentList,
    combinedDocumentList,
    isSignatoryDocument,
    fileSizeDescription,
  };
};
