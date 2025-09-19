import { MAX_ATTACHMENT_FILE_SIZE_MB } from '@services/message-service';
import { FormErrorMessage, FormLabel, Input, cx } from '@sk-web-gui/react';
import { Upload } from 'lucide-react';
import { KeyboardEvent, useEffect, useRef, useState } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { useFileUpload } from './file-upload.context';
import { handleFiles, resetErrors } from './file-upload-utils';

const FileUpload: React.FC<{
  fieldName: string;
  allowMultiple?: boolean;
  allowMax?: number;
  accept?: string[];
  label?: string;
  helperText?: string;
  showLabel?: boolean;
  allowReplace?: boolean;
  maxFileSizeMB?: number;
  onErrorReset?: () => void;
  resetErrorTrigger?: number;
}> = ({
  fieldName,
  allowMultiple = true,
  allowMax = 4,
  accept = [],
  label,
  helperText,
  showLabel,
  allowReplace = false,
  maxFileSizeMB = MAX_ATTACHMENT_FILE_SIZE_MB,
  onErrorReset,
  resetErrorTrigger,
}) => {
  const [error, setError] = useState<string>();
  const [fileErrors, setFileErrors] = useState<string[]>([]);
  const [added, setAdded] = useState<number>(0);
  const ref = useRef<HTMLLabelElement>(null);

  const {
    register,
    control,
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<{ newItem: FileList | undefined } & Record<string, any>>();

  const newItem: FileList = watch(`${fieldName}-newItem`);

  const { fields, append, replace } = useFieldArray({
    control,
    name: fieldName,
  });

  const { drop, setDrop, setActive } = useFileUpload();

  useEffect(() => {
    if (fields.length !== added) {
      setAdded(fields.length);
    }
  }, [fields.length, added]);

  useEffect(() => {
    setActive?.(true);
    return () => setActive?.(false);
  }, [setActive]);

  useEffect(() => {
    if (!newItem?.[0]) return;

    resetErrors(setFileErrors, setError, onErrorReset);
    handleFiles({
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
    });
  }, [newItem]);

  useEffect(() => {
    if (resetErrorTrigger && resetErrorTrigger > 0) {
      resetErrors(setFileErrors, setError, onErrorReset);
    }
  }, [resetErrorTrigger]);

  useEffect(() => {
    if (drop && drop?.length > 0) {
      setValue(`${fieldName}-newItem`, drop);
      setDrop?.(null);
    }
  }, [drop, fieldName, setDrop, setValue]);

  const handleKeyPress = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      ref.current?.click();
    }
  };

  return (
    <div>
      <div className="flex flex-col items-start">
        <FormLabel ref={ref} className="w-full">
          {showLabel && label && <span className="block mb-sm text-label font-bold">{label}</span>}
          <div
            role="input"
            onKeyDown={handleKeyPress}
            aria-label={label}
            tabIndex={0}
            className={cx(
              'rounded-utility',
              'focus-within:ring',
              'focus-within:ring-ring',
              'focus-within:ring-offset',
              'text-base gap-16 box-border flex flex-col justify-center items-center',
              'p-12 md:p-24 xl:p-32',
              'bg-vattjom-background-100',
              'border border-vattjom-surface-primary',
              'hover:bg-vattjom-background-200 hover:border-solid border-dashed cursor-pointer'
            )}
          >
            <Upload className="!h-[4rem] !w-[4rem] text-primary" />
            <div className="flex flex-col gap-8 justify-center">
              <div className="text-base font-normal">
                <span className="underline text-vattjom-text-primary">Välj {allowMultiple ? 'filer' : 'fil'}</span>{' '}
                eller dra och släpp {allowMultiple ? 'dem' : 'den'} här
              </div>
              {helperText && <FormErrorMessage>{helperText}</FormErrorMessage>}
            </div>
          </div>
          <Input
            className="hidden"
            type="file"
            accept={accept.join(',')}
            multiple={allowMultiple}
            placeholder="Välja fil att lägga till"
            {...register(`${fieldName}-newItem`)}
          />
        </FormLabel>
      </div>

      <div>
        {errors?.newItem && <FormErrorMessage className="my-sm">{errors?.newItem.message}</FormErrorMessage>}
        {error && <FormErrorMessage className="my-sm">{error}</FormErrorMessage>}
        {fileErrors.map((e, idx) => (
          <FormErrorMessage key={`fileError-${idx}`} className="my-sm">
            {e}
          </FormErrorMessage>
        ))}
      </div>
    </div>
  );
};

export default FileUpload;
