import { SetStateAction } from 'react';

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
};

const calculateExistingTotalMB = (files: { file?: File }[]): number =>
  files.reduce((sum, f) => sum + (f.file?.size || 0) / 1024 / 1024, 0);

const calculateNewFilesTotalMB = (files: FileList): number =>
  Array.from(files).reduce((sum, f) => sum + f.size / 1024 / 1024, 0);

const buildFileValidators = (accept: string[], allowMax: number, allowReplace: boolean): Validator[] => [
  (file) => {
    const ext = `.${file.name.split('.').pop()?.toLowerCase()}`;
    return accept.length > 0 && !accept.includes(ext) ? `Fel filtyp - ${file.name}` : undefined;
  },
  (file) => (file.size === 0 ? 'Filen du försöker bifoga är tom. Försök igen.' : undefined),
  (_, count) =>
    count === allowMax && !allowReplace ? `För många valda filer - max ${allowMax} st kan läggas till.` : undefined,
];

const validateFile = (file: File, count: number, validators: Validator[]): string[] =>
  validators.map((v) => v(file, count)).filter((msg): msg is string => Boolean(msg));

const validateTotalSize = (existingMB: number, newMB: number, maxMB: number): string | undefined => {
  const total = existingMB + newMB;
  if (total > maxMB) {
    return `Totala filstorleken (${total.toFixed(1)} MB) överskrider gränsen på ${maxMB} MB.`;
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
  setFileErrors,
  onErrorReset,
  fields,
}: FileHandlerProps & { fields: { file?: File }[] }) => {
  resetFileState(setFileErrors, onErrorReset);

  let numberOfAddedFiles = added;
  const existingTotalMB = calculateExistingTotalMB(fields);
  const newFiles = Array.from(newItem).filter(Boolean);
  const newFilesTotalMB = calculateNewFilesTotalMB(newItem);

  const sizeError = validateTotalSize(existingTotalMB, newFilesTotalMB, maxFileSizeMB);
  if (sizeError) {
    setFileErrors([sizeError]);
    return;
  }

  const validators = buildFileValidators(accept, allowMax, allowReplace);
  let runningTotalMB = existingTotalMB;

  for (const original of newFiles) {
    const file = new File([original], original.name, {
      type: original.type,
      lastModified: original.lastModified,
    });

    const fileSizeMB = file.size / 1024 / 1024;
    const errors: string[] = [];

    const sizeExceeded = validateTotalSize(runningTotalMB, fileSizeMB, maxFileSizeMB);
    if (sizeExceeded) errors.push(sizeExceeded);

    errors.push(...validateFile(file, numberOfAddedFiles, validators));

    if (errors.length > 0) {
      setFileErrors((prev) => [...prev, ...errors]);
    } else {
      numberOfAddedFiles = handleFileAppend({
        file,
        allowMax,
        allowReplace,
        numberOfAddedFiles,
        append,
        replace,
      });
      runningTotalMB += fileSizeMB;
    }
  }

  setAdded(numberOfAddedFiles);
  setValue(`${fieldName}-newItem`, undefined);
};

export const resetErrors = (setFileErrors: (value: SetStateAction<string[]>) => void, onErrorReset?: () => void) => {
  setFileErrors([]);
  onErrorReset?.();
};
