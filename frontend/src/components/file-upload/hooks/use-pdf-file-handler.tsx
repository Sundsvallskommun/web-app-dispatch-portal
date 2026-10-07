import { CustomOnChangeEventUploadFile, UploadFile } from '@sk-web-gui/react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

interface FileAttachmentFormModel {
  [field: string]: UploadFile[];
}

interface PdfErrorKeys {
  badFile: string;
  totalSize?: string;
  duplicateFileName: string;
  emptyFile: string;
  maxNumberFiles: string;
}

interface UsePdfFileHandlerOptions {
  errorKeys: PdfErrorKeys;
  maxFileSizeMB?: number;
  maxFiles?: number;
  fieldName?: string;
  existingFileNames?: string[];
}

export const usePdfFileHandler = ({
  errorKeys,
  maxFileSizeMB,
  maxFiles,
  fieldName = 'attachmentList',
  existingFileNames = [],
}: UsePdfFileHandlerOptions) => {
  const {
    setError,
    setValue,
    getValues,
    clearErrors,
    formState: { errors },
  } = useFormContext<FileAttachmentFormModel>();
  const { t } = useTranslation();

  const getFileErrors = (
    item: UploadFile,
    {
      currentNames,
      currentBytes,
      totalCount,
      maxBytes,
    }: { currentNames: Set<string>; currentBytes: number; totalCount: number; maxBytes?: number }
  ): string[] => {
    const file = item.file;
    const name = file?.name;
    const nextBytes = currentBytes + (file?.size ?? 0);
    const errors: string[] = [];

    if (file?.size === 0) errors.push(t(errorKeys.emptyFile));
    if (name && currentNames.has(name)) errors.push(t(errorKeys.duplicateFileName, { fileName: name }));
    if (maxFiles !== undefined && totalCount >= maxFiles) {
      errors.push(t(errorKeys.maxNumberFiles, { allowMax: maxFiles }));
    }
    if (maxBytes !== undefined && errorKeys.totalSize && nextBytes > maxBytes) {
      errors.push(t(errorKeys.totalSize, { total: (nextBytes / 1024 / 1024).toFixed(1), maxMB: maxFileSizeMB }));
    }

    return errors;
  };

  const handleFiles = (event: CustomOnChangeEventUploadFile) => {
    const incoming = event.target.value ?? [];
    if (incoming.length === 0) return;

    const current = getValues(fieldName) ?? [];
    const accepted: UploadFile[] = [];
    const messages: string[] = [];

    const currentNames = new Set([
      ...existingFileNames,
      ...(current.map((a) => a.file?.name).filter(Boolean) as string[]),
    ]);
    const maxBytes = maxFileSizeMB !== undefined ? maxFileSizeMB * 1024 * 1024 : undefined;
    let currentBytes = current.reduce((sum, a) => sum + (a.file?.size ?? 0), 0);

    for (const item of incoming) {
      const fileErrors = getFileErrors(item, {
        currentNames,
        currentBytes,
        totalCount: current.length + accepted.length,
        maxBytes,
      });

      if (fileErrors.length > 0) {
        messages.push(...fileErrors);
        continue;
      }

      accepted.push(item);
      if (item.file?.name) currentNames.add(item.file.name);
      currentBytes += item.file?.size ?? 0;
    }

    const errorMessages = Array.from(new Set(messages));

    if (errorMessages.length > 0) {
      setError(fieldName, { message: errorMessages.join('\n') });
    } else {
      clearErrors(fieldName);
    }

    if (accepted.length > 0) {
      setValue(fieldName, [...current, ...accepted]);
    }
  };

  const handleError = (msg: string) => {
    if (msg.startsWith('Filen är för stor')) {
      setError(fieldName, { message: msg });
      return;
    }
    setError(fieldName, { message: t(errorKeys.badFile) });
  };

  const pdfError = errors?.[fieldName];

  return { handleFiles, handleError, pdfError };
};
