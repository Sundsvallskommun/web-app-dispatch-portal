import { MAX_ATTACHMENT_FILE_SIZE_MB } from '@services/message-service';
import { FormErrorMessage, FormHelperText, FormLabel, Input, cx } from '@sk-web-gui/react';
import { UploadCloud } from 'lucide-react';
import { KeyboardEvent, useEffect, useRef, useState } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { useFileUpload } from './file-upload.context';

const FileUpload: React.FC<{
  fieldName: string;
  allowMultiple?: boolean;
  allowMax?: number;
  accept?: string[];
  label?: string;
  helperText?: string;
  showLabel?: boolean;
  allowReplace?: boolean;
}> = (props) => {
  const {
    fieldName,
    allowMultiple = true,
    allowMax = 4,
    accept = [],
    label,
    helperText,
    showLabel,
    allowReplace = false,
  } = props;
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
    //eslint-disable-next-line
  } = useFormContext<{ newItem: FileList | undefined } & Record<string, any>>();

  const newItem: FileList = watch(`${fieldName}-newItem`);

  const { fields, append, replace } = useFieldArray({
    control,
    name: fieldName,
  });

  useEffect(() => {
    const length = fields.length;
    if (added !== length) {
      setAdded(length);
    }
    //eslint-disable-next-line
  }, [fields]);

  const { drop, setDrop, setActive } = useFileUpload();

  useEffect(() => {
    setActive && setActive(true);

    return () => {
      setActive && setActive(false);
    };
  }, [setActive]);

  const fileHandler = () => {
    setFileErrors([]);
    setError(undefined);
    // e.preventDefault();
    let N = added;
    for (let i = 0; i < newItem.length; i += 1) {
      if (newItem && newItem.item(i)) {
        const original = newItem.item(i);
        if (original) {
          const file = new File([original], original.name, {
            type: original.type,
            lastModified: original.lastModified,
          });
          const ext = `.${file?.name?.split('.').pop()}`;
          if (accept.length !== 0 && !accept.includes(ext.toLowerCase())) {
            const t = `Fel filtyp - ${file.name}`;
            // setError(t);
            setFileErrors((fileErrors) => [...fileErrors, t]);
          } else if (file.size / 1024 / 1024 > MAX_ATTACHMENT_FILE_SIZE_MB) {
            const s = `Filen är för stor (${(file.size / 1024 / 1024).toFixed(1)} MB) - ${file.name}`;
            // setError(s);
            setFileErrors((fileErrors) => [...fileErrors, s]);
          } else if (N === allowMax) {
            if (N === allowMax && allowReplace) {
              replace({ file });
            } else {
              setError(`För många valda filer - max ${allowMax} st kan läggas till.`);
            }
          } else if (file.size === 0) {
            setError('Filen du försöker bifoga är tom. Försök igen.');
          } else {
            append({ file });
            N += 1;
            setValue(`newItem`, undefined);
            setError(undefined);
          }
        }
      }
    }
    setAdded(N);
    setValue(`${fieldName}-newItem`, undefined);
  };

  useEffect(() => {
    newItem?.[0] && fileHandler();
    //eslint-disable-next-line
  }, [newItem]);

  useEffect(() => {
    if (drop && drop.length > 0) {
      setValue(`${fieldName}-newItem`, drop);
    }
    setDrop && setDrop(null);
  });

  const handleKeyPress = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter') {
      event.preventDefault();
      ref.current && ref.current.click();
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
              'text-base gap-16 box-border flex justify-center items-center',
              'p-12 md:p-24 xl:p-32',
              'border border-divider',
              'hover:bg-vattjom-background-100 hover:border-2 border-dashed cursor-pointer'
            )}
          >
            <UploadCloud className={cx('!h-[4rem] !w-[4rem] text-primary')} />
            <div className="flex flex-col gap-8 justify-center">
              <div className="text-base font-normal">
                Dra {allowMultiple ? 'filer' : 'en fil'} hit eller{' '}
                <span className="underline text-vattjom-text-primary">klicka för att bläddra på din enhet</span>
              </div>
              {helperText && (
                <FormHelperText className="p-0 m-0 text-small text-dark-secondary">{helperText}</FormHelperText>
              )}
            </div>
          </div>
          <Input
            className="hidden"
            type="file"
            accept={accept.join(',')}
            multiple={allowMultiple}
            placeholder="Välja fil att lägga till"
            {...register(`${fieldName}-newItem`)}
            allowReplace={false}
          />
        </FormLabel>
      </div>

      <div>
        {errors?.newItem && <FormErrorMessage className="my-sm">{errors?.newItem.message}</FormErrorMessage>}
        {error && <FormErrorMessage className="my-sm">{error}</FormErrorMessage>}
        {fileErrors.length > 0 &&
          fileErrors.map((e, idx) => (
            <FormErrorMessage key={`fileError-${idx}`} className="my-sm">
              {e}
            </FormErrorMessage>
          ))}
      </div>
    </div>
  );
};

export default FileUpload;
