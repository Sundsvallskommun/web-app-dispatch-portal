import { Attachment } from '@components/attachment-handler/attachment-handler';
import { CustomOnChangeEventUploadFile, useConfirm } from '@sk-web-gui/react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Csv } from 'src/data-contracts/backend/data-contracts';

interface CsvRecipientFileFormModel {
  recipientList: Array<Csv & Attachment>;
}

interface CsvWarningKeys {
  title: string;
  duplicates: string;
  rejections: string;
  description: string;
  confirm: string;
  cancel: string;
}

interface CsvErrorKeys {
  csvPrefix: string;
  csvFetch: string;
  badFile: string;
}

interface UseCsvRecipientFileHandlerOptions {
  checkCsv: (file: File) => Promise<Csv>;
  warningKeys: CsvWarningKeys;
  errorKeys: CsvErrorKeys;
}

export const useCsvRecipientFileHandler = ({ checkCsv, warningKeys, errorKeys }: UseCsvRecipientFileHandlerOptions) => {
  const { showConfirmation } = useConfirm();
  const { t } = useTranslation();
  const {
    setError,
    setValue,
    clearErrors,
    formState: { errors },
  } = useFormContext<CsvRecipientFileFormModel>();

  const handleFiles = async (event: CustomOnChangeEventUploadFile) => {
    const files = event.target.value;
    if (!files?.[0]) return;
    try {
      const csvData = await checkCsv(files[0].file);
      if (csvData.status === 'OK') {
        const countDuplicates = Object.keys(csvData.duplicateEntries ?? {}).length;
        const countRejections = (csvData.rejectedEntries ?? []).length;
        if (countDuplicates > 0 || countRejections > 0) {
          const message = (
            <>
              {countDuplicates > 0 ? <p>{t(warningKeys.duplicates, { count: countDuplicates })}</p> : <></>}
              {countRejections > 0 ? <p>{t(warningKeys.rejections, { count: countRejections })}</p> : <></>}
              <p>{t(warningKeys.description)}</p>
            </>
          );

          showConfirmation(
            t(warningKeys.title),
            message,
            t(warningKeys.confirm),
            t(warningKeys.cancel),
            'warning'
          ).then((confirm) => {
            if (confirm) {
              setValue('recipientList', [{ ...csvData, file: files[0].file }]);
            } else {
              setValue('recipientList', []);
            }
          });
        } else {
          setValue('recipientList', [{ ...csvData, file: files[0].file }]);
        }
        clearErrors('recipientList');
      } else {
        setValue('recipientList', []);
        setError('recipientList', {
          message: `${errorKeys.csvPrefix}.${csvData.error ?? 'UNKNOWN'}`,
        });
      }
    } catch {
      setError('recipientList', { message: errorKeys.csvFetch });
    }
  };

  const handleError = () => {
    setError('recipientList', { message: errorKeys.badFile });
  };

  const recipientListError = errors?.recipientList;

  return { handleFiles, handleError, recipientListError };
};
