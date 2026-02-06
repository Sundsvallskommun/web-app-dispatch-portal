import { FormErrorMessage, FormLabel, Input, cx } from '@sk-web-gui/react';
import { Upload } from 'lucide-react';
import { KeyboardEvent, useEffect, useRef, useState } from 'react';
import { useFieldArray, useFormContext } from 'react-hook-form';
import { useFileUpload } from './file-upload.context';
import { handleFiles, resetErrors } from './file-upload-utils';
import { AttachmentFormModel } from '@components/attachment-handler/attachment-handler';
import { Trans, useTranslation } from 'react-i18next';
import CustomFormErrorMessage from '@components/custom-form-error-message/custom-form-error-message.component';
import { MAX_ATTACHMENT_FILE_SIZE_MB } from '@utils/file.utils';

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
}) => {
  const [fileErrors, setFileErrors] = useState<string[]>([]);
  const [added, setAdded] = useState<number>(0);
  const ref = useRef<HTMLLabelElement>(null);
  const { t } = useTranslation(['send-mail']);

  const {
    register,
    control,
    watch,
    setValue,
    setError,
    formState: { errors },
    clearErrors,
  } = useFormContext<{ newItem: FileList | undefined } & Record<string, any> & AttachmentFormModel>(); // eslint-disable-line @typescript-eslint/no-explicit-any

  const newItem: FileList = watch(`${fieldName}-newItem`);

  const { fields, append, replace } = useFieldArray({
    control,
    name: fieldName,
  });

  const fileFields = (fields as { file?: File }[]).map((f) => ({ file: f.file }));

  const { drop, setDrop, setActive } = useFileUpload();

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    if (fields.length !== added) {
      setAdded(fields.length);
    }
    clearErrors(fieldName);
  }, [fields.length, added]);

  useEffect(() => {
    setActive?.(true);
    return () => setActive?.(false);
  }, [setActive]);

  /* eslint-disable react-hooks/exhaustive-deps */
  useEffect(() => {
    if (!newItem?.[0]) return;
    clearErrors(fieldName);
    resetErrors(setFileErrors, onErrorReset);
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
      fields: fileFields,
      setError,
      clearErrors,
      t,
    });
  }, [newItem]);
  /* eslint-enable react-hooks/exhaustive-deps */

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
              'text-base gap-16 box-border flex justify-center items-center border p-32',
              'hover:border-solid border-dashed cursor-pointer',
              fileErrors.length || errors.attachmentList ? 'bg-error-background-100' : 'bg-vattjom-background-100',
              fileErrors.length || errors.attachmentList
                ? 'border-error-surface-primary hover:bg-error-background-200'
                : 'border-vattjom-surface-primary hover:bg-vattjom-background-200'
            )}
          >
            <Upload className="!h-[4rem] !w-[4rem] text-primary" />
            <div className="flex flex-col gap-8 justify-center">
              <div className="text-base font-normal">
                <Trans
                  i18nKey={`send-mail:attachmentHandler.uploadHelper${allowMultiple ? 'Multiple' : 'Single'}`}
                  components={{
                    span: <span className="underline text-vattjom-text-primary" />,
                  }}
                />
              </div>
              {helperText && <FormErrorMessage>{helperText}</FormErrorMessage>}
            </div>
          </div>
          <Input
            data-cy="file-input"
            className="hidden"
            type="file"
            accept={accept.join(',')}
            multiple={allowMultiple}
            placeholder={t('send-mail:attachmentHandler.uploadInputPlaceHolder')}
            {...register(`${fieldName}-newItem`)}
          />
        </FormLabel>
      </div>
      {errors?.[fieldName]?.message && <CustomFormErrorMessage message={errors[fieldName]?.message?.toString()} />}
      {errors?.newItem && <FormErrorMessage className="my-sm">{errors?.newItem.message}</FormErrorMessage>}
    </div>
  );
};

export default FileUpload;
