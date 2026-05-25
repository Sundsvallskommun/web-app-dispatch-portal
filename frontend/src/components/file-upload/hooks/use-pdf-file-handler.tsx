import { CustomOnChangeEventUploadFile, UploadFile } from '@sk-web-gui/react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

interface FileAttachmentFormModel {
  attachmentList: UploadFile[];
}

interface PdfErrorKeys {
  badFile: string;
  totalSize: string;
  duplicateFileName: string;
  emptyFile: string;
  maxNumberFiles: string;
}

interface UsePdfFileHandlerOptions {
  errorKeys: PdfErrorKeys;
  maxFileSizeMB: number;
  maxFiles: number;
}

export const usePdfFileHandler = ({ errorKeys, maxFileSizeMB, maxFiles }: UsePdfFileHandlerOptions) => {
  const {
    setError,
    setValue,
    getValues,
    clearErrors,
    formState: { errors },
  } = useFormContext<FileAttachmentFormModel>();
  const { t } = useTranslation();

  const handleFiles = (event: CustomOnChangeEventUploadFile) => {
    const incoming = event.target.value ?? [];
    if (incoming.length === 0) return;

    const current = getValues('attachmentList') ?? [];
    const accepted: UploadFile[] = [];
    const messages: string[] = [];

    const currentNames = new Set(current.map((a) => a.file?.name).filter(Boolean));
    const maxBytes = maxFileSizeMB * 1024 * 1024;
    let currentBytes = current.reduce((sum, a) => sum + (a.file?.size ?? 0), 0);

    for (const item of incoming) {
      const file = item.file;
      const name = file?.name;
      const fileErrors: string[] = [];

      if (file?.size === 0) {
        fileErrors.push(t(errorKeys.emptyFile));
      }

      if (name && currentNames.has(name)) {
        fileErrors.push(t(errorKeys.duplicateFileName, { fileName: name }));
      }

      if (current.length + accepted.length >= maxFiles) {
        fileErrors.push(t(errorKeys.maxNumberFiles, { allowMax: maxFiles }));
      }
      
      const nextBytes = currentBytes + (file?.size ?? 0);
      if (nextBytes > maxBytes) {
        fileErrors.push(
          t(errorKeys.totalSize, {
            total: (nextBytes / 1024 / 1024).toFixed(1),
            maxMB: maxFileSizeMB,
          })
        );
      }

      if (fileErrors.length > 0) {
        messages.push(...fileErrors);
        continue;
      }

      accepted.push(item);
      if (name) currentNames.add(name);
      currentBytes += file?.size ?? 0;
    }

    const errorMessages = Array.from(new Set(messages));

    if (errorMessages.length > 0) {
      setError('attachmentList', { message: errorMessages.join('\n') });
    } else {
      clearErrors('attachmentList');
    }

    if (accepted.length > 0) {
      setValue('attachmentList', [...current, ...accepted]);
    }
  };

  const handleError = () => {
    setError('attachmentList', { message: errorKeys.badFile });
  };

  const pdfError = errors?.attachmentList;

  return { handleFiles, handleError, pdfError };
};
