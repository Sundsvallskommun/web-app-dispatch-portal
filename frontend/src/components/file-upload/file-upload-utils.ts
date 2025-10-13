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
  onErrorReset,
  fields,
}: FileHandlerProps & { fields: { file?: File }[] }) => {
  resetErrors(setFileErrors, onErrorReset);

  let numberOfAddedFiles = added;

  const existingTotalMB = fields.reduce((sum, f) => sum + (f.file?.size || 0) / 1024 / 1024, 0);
  const newFiles = Array.from(newItem).filter(Boolean);
  const newFilesTotalMB = newFiles.reduce((sum, f) => sum + f.size / 1024 / 1024, 0);

  if (existingTotalMB + newFilesTotalMB > maxFileSizeMB) {
    setFileErrors([
      `Totala filstorleken (${(existingTotalMB + newFilesTotalMB).toFixed(
        1
      )} MB) överskrider gränsen på ${maxFileSizeMB} MB.`,
    ]);
    return;
  }

  type Validator = (file: File, currentCount: number) => string | undefined;

  const validators: Validator[] = [
    (file) => {
      const ext = `.${file.name.split('.').pop()?.toLowerCase()}`;
      return accept.length > 0 && !accept.includes(ext) ? `Fel filtyp - ${file.name}` : undefined;
    },
    (file) => (file.size === 0 ? 'Filen du försöker bifoga är tom. Försök igen.' : undefined),
    (_, count) =>
      count === allowMax && !allowReplace ? `För många valda filer - max ${allowMax} st kan läggas till.` : undefined,
  ];

  const validateFile = (file: File, count: number): string[] =>
    validators.map((v) => v(file, count)).filter((msg): msg is string => Boolean(msg));

  let runningTotalMB = existingTotalMB;

  for (const original of newFiles) {
    if (original) {
      const file = new File([original], original.name, {
        type: original.type,
        lastModified: original.lastModified,
      });

      const fileSizeMB = file.size / 1024 / 1024;
      const fileErrorsList: string[] = [];

      if (runningTotalMB + fileSizeMB > maxFileSizeMB) {
        fileErrorsList.push(
          `Totala filstorleken (${(runningTotalMB + fileSizeMB).toFixed(
            1
          )} MB) överskrider gränsen på ${maxFileSizeMB} MB.`
        );
      }

      fileErrorsList.push(...validateFile(file, numberOfAddedFiles));

      if (fileErrorsList.length > 0) {
        setFileErrors((prev) => [...prev, ...fileErrorsList]);
      } else {
        if (numberOfAddedFiles === allowMax && allowReplace) {
          replace({ file });
        } else {
          append({ file });
          numberOfAddedFiles += 1;
        }

        runningTotalMB += fileSizeMB;
      }
    }
  }

  setAdded(numberOfAddedFiles);
  setValue(`${fieldName}-newItem`, undefined);
};

export const resetErrors = (setFileErrors: (value: SetStateAction<string[]>) => void, onErrorReset?: () => void) => {
  setFileErrors([]);
  onErrorReset?.();
};
