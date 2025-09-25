import { SetStateAction } from 'react';

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
  setError: (value: SetStateAction<string | undefined>) => void;
  onErrorReset?: () => void;
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
  setError,
  onErrorReset,
}: FileHandlerProps) => {
  resetErrors(setFileErrors, setError, onErrorReset);

  let numberOfAddedFiles = added;

  type Validator = (file: File, currentCount: number) => string | undefined;

  const validators: Validator[] = [
    (file) => {
      const ext = `.${file.name.split('.').pop()?.toLowerCase()}`;
      return accept.length > 0 && !accept.includes(ext) ? `Fel filtyp - ${file.name}` : undefined;
    },
    (file) =>
      file.size / 1024 / 1024 > maxFileSizeMB
        ? `Filen är för stor (${(file.size / 1024 / 1024).toFixed(1)} MB) - ${file.name}`
        : undefined,
    (_, count) =>
      count === allowMax && !allowReplace ? `För många valda filer - max ${allowMax} st kan läggas till.` : undefined,
    (file) => (file.size === 0 ? 'Filen du försöker bifoga är tom. Försök igen.' : undefined),
  ];

  const validateFile = (file: File, count: number): string[] =>
    validators.map((v) => v(file, count)).filter((msg): msg is string => Boolean(msg));

  Array.from(newItem).forEach((original) => {
    if (!original) return;

    const file = new File([original], original.name, {
      type: original.type,
      lastModified: original.lastModified,
    });

    const errors = validateFile(file, numberOfAddedFiles);

    if (errors.length > 0) {
      setFileErrors((prev) => [...prev, ...errors]);
      return;
    }

    if (numberOfAddedFiles === allowMax && allowReplace) {
      replace({ file });
    } else {
      append({ file });
      numberOfAddedFiles += 1;
    }

    setValue('newItem', undefined);
    setError(undefined);
  });

  setAdded(numberOfAddedFiles);
  setValue(`${fieldName}-newItem`, undefined);
};

export const resetErrors = (
  setFileErrors: (value: SetStateAction<string[]>) => void,
  setError: (value: SetStateAction<string | undefined>) => void,
  onErrorReset?: () => void
) => {
  setFileErrors([]);
  setError(undefined);
  onErrorReset?.();
};
