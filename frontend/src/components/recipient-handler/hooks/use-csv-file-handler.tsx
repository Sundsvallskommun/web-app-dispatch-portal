import { Attachment } from '@components/attachment-handler/attachment-handler';
import { CustomOnChangeEventUploadFile, useConfirm } from '@sk-web-gui/react';
import { ReactElement } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { Csv } from 'src/data-contracts/backend/data-contracts';

interface CsvRecipientFileFormModel {
  recipientList: Array<Csv & Attachment>;
}

interface CsvWarningKeys {
  title: string;
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


  const handleWarningMessage = (
    csvData: Csv
  ): {
    countRejections: number;
    warningMessage: ReactElement | null;
  } => {
    const rejectedEntries = (csvData.rejectedEntries ?? []).filter(Boolean);
    const countRejections = rejectedEntries.length;

    if (countRejections === 0) {
      return { countRejections: 0, warningMessage: null };
    }

    return {
      countRejections,
      warningMessage: (
        <>
          <p>{t(warningKeys.description)}</p>

          {countRejections > 0 && (
            <div>
              {rejectedEntries.map((entry) => (
                <p key={entry}>{entry}</p>
              ))}
            </div>
          )}
        </>
      ),
    };
  };

  const handleFiles = async (event: CustomOnChangeEventUploadFile) => {
    const file = event.target.value?.[0]?.file;
    if (!file) return;

    let csvData: Csv;
    try {
      csvData = await checkCsv(file);
    } catch {
      setError('recipientList', { message: errorKeys.csvFetch });
      return;
    }

    if (csvData.status !== 'OK') {
      setValue('recipientList', []);
      setError('recipientList', {
        message: `${errorKeys.csvPrefix}.${csvData.error ?? 'UNKNOWN'}`,
      });
      return;
    }

    clearErrors('recipientList');

    const { warningMessage, countRejections } = handleWarningMessage(csvData);

    if (!warningMessage) {
      setValue('recipientList', [{ ...csvData, file }]);
      return;
    }

    const confirmed = await showConfirmation(
      t(warningKeys.title, { csvFile: csvData.name, count: countRejections }),
      warningMessage,
      t(warningKeys.confirm),
      t(warningKeys.cancel),
      'info'
    );
    setValue('recipientList', confirmed ? [{ ...csvData, file }] : []);
  };

  const handleError = () => {
    setError('recipientList', { message: errorKeys.badFile });
  };

  const recipientListError = errors?.recipientList;

  return { handleFiles, handleError, recipientListError };
};
