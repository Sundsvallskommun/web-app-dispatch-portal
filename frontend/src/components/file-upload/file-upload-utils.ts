import { SetStateAction } from 'react';
import { FieldValues, UseFormClearErrors, UseFormSetError } from 'react-hook-form';

type Validator = (file: File, currentCount: number) => string | undefined;

type FileHandlerProps = {
  newItem: FileList;
  added: number;
  allowMax: number;
  allowReplace: boolean;
  maxFileSizeMB: number;
  accept: string[];
  fieldName: string;
  append: (args: { file: File }) => void;
  replace: (args: { file: File }) => void;
  setAdded: (n: number) => void;
  setValue: (name: string, value: any) => void; // eslint-disable-line @typescript-eslint/no-explicit-any
  setFileErrors: (value: SetStateAction<string[]>) => void;
  onErrorReset?: () => void;
  t: (key: string, options?: Record<string, unknown>) => string;
};

const calculateExistingTotalMB = (files: { file?: File }[]): number =>
  files.reduce((sum, f) => sum + (f.file?.size || 0) / 1024 / 1024, 0);

const calculateNewFilesTotalMB = (files: FileList): number =>
  Array.from(files).reduce((sum, f) => sum + f.size / 1024 / 1024, 0);

const buildFileValidators = (
  accept: string[],
  allowMax: number,
  allowReplace: boolean,
  t: (key: string, options?: Record<string, unknown>) => string
): Validator[] => [
  (file) => {
    const ext = `.${file.name.split('.').pop()?.toLowerCase()}`;
    return accept.length > 0 && !accept.includes(ext)
      ? t('send-mail:attachmentHandler.validation.wrongFileType', {
          fileName: file.name,
        })
      : undefined;
  },
  (file) => (file.size === 0 ? t('send-mail:attachmentHandler.validation.emptyFile') : undefined),
  (_, count) =>
    count === allowMax && !allowReplace
      ? t('send-mail:attachmentHandler.validation.maxNumberFiles', {
          allowMax: allowMax,
        })
      : undefined,
];

const validateFile = (file: File, count: number, validators: Validator[]): string[] =>
  validators.map((v) => v(file, count)).filter((msg): msg is string => Boolean(msg));

const validateTotalSize = (
  existingMB: number,
  newMB: number,
  maxMB: number,
  t: (key: string, options?: Record<string, unknown>) => string
): string | undefined => {
  const total = existingMB + newMB;
  if (total > maxMB) {
    return t('send-mail:attachmentHandler.validation.totalSize', {
      total: total.toFixed(1),
      maxMB: maxMB,
    });
  }
};

const handleFileAppend = ({
  file,
  allowMax,
  allowReplace,
  numberOfAddedFiles,
  append,
  replace,
}: {
  file: File;
  allowMax: number;
  allowReplace: boolean;
  numberOfAddedFiles: number;
  append: (file: { file: File }) => void;
  replace: (file: { file: File }) => void;
}): number => {
  if (numberOfAddedFiles === allowMax && allowReplace) {
    replace({ file });
  } else {
    append({ file });
    numberOfAddedFiles += 1;
  }
  return numberOfAddedFiles;
};

export const resetFileState = (setFileErrors: (value: SetStateAction<string[]>) => void, onErrorReset?: () => void) => {
  resetErrors(setFileErrors, onErrorReset);
};

export const handleFiles = ({
  newItem,
  added,
  allowMax,
  allowReplace,
  maxFileSizeMB,
  accept,
  fieldName,
  append,
  replace,
  setAdded,
  setValue,
  setError,
  clearErrors,
  fields,
  t,
}: Omit<FileHandlerProps, 'setFileErrors' | 'onErrorReset'> & {
  setError: UseFormSetError<FieldValues>;
  clearErrors: UseFormClearErrors<FieldValues>;
  fields: { file?: File }[];
}) => {
  clearErrors(fieldName);
  let numberOfAddedFiles = added;
  const existingTotalMB = calculateExistingTotalMB(fields);
  const newFiles = Array.from(newItem).filter(Boolean);
  const newFilesTotalMB = calculateNewFilesTotalMB(newItem);

  const sizeError = validateTotalSize(existingTotalMB, newFilesTotalMB, maxFileSizeMB, t);
  if (sizeError) {
    setError(fieldName, { type: 'manual', message: sizeError });
    return;
  }

  const validators = buildFileValidators(accept, allowMax, allowReplace, t);
  let runningTotalMB = existingTotalMB;
  const allErrors: string[] = [];

  const existingFileNames: string[] = [];

  for (const field of fields) {
    if (field.file?.name) {
      existingFileNames.push(field.file.name);
    }
  }

  const existingNames = new Set(existingFileNames);

  for (const original of newFiles) {
    const file = new File([original], original.name, { type: original.type, lastModified: original.lastModified });
    const fileSizeMB = file.size / 1024 / 1024;
    const errors: string[] = [];

    if (existingNames.has(file.name)) {
      errors.push(
        t('send-mail:attachmentHandler.validation.duplicateFileName', {
          fileName: file.name,
        })
      );
    }

    const sizeExceeded = validateTotalSize(runningTotalMB, fileSizeMB, maxFileSizeMB, t);
    if (sizeExceeded) errors.push(sizeExceeded);
    errors.push(...validateFile(file, numberOfAddedFiles, validators));

    if (errors.length > 0) {
      allErrors.push(...errors);
    } else {
      numberOfAddedFiles = handleFileAppend({ file, allowMax, allowReplace, numberOfAddedFiles, append, replace });
      runningTotalMB += fileSizeMB;
    }
  }

  if (allErrors.length > 0) {
    setError(fieldName, { type: 'manual', message: allErrors.join('\n') });
  } else {
    clearErrors(fieldName);
  }

  setAdded(numberOfAddedFiles);
  setValue(`${fieldName}-newItem`, undefined);
};

export const resetErrors = (setFileErrors: (value: SetStateAction<string[]>) => void, onErrorReset?: () => void) => {
  setFileErrors([]);
  onErrorReset?.();
};
