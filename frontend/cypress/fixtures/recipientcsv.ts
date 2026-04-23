import { Csv, CsvApiResponse } from 'src/data-contracts/backend/data-contracts';

interface csvOptions {
  duplicates?: boolean;
  rejections?: boolean;
  error?: Csv['error'];
}

export const recipientcsv = (
  status: Csv['status'],
  options: csvOptions = { duplicates: false, rejections: false, error: 'UNKNOWN' }
): CsvApiResponse => {
  const { duplicates = false, rejections = false, error = 'UNKNOWN' } = options;
  return {
    data: {
      name: 'personal-numbers.csv',
      id: '1234-2345-3456',
      status,
      error: status === 'BAD' ? error : undefined,
      duplicateEntries: duplicates ? { '199011182475': 2, '192301010159': 3 } : undefined,
      rejectedEntries: rejections ? ['189001019802', '179001019802'] : undefined,
    },
    message: 'success',
  };
};

export const recipientCsvSms = (
  status: Csv['status'],
  options: csvOptions = { duplicates: false, rejections: false, error: 'UNKNOWN' }
): CsvApiResponse => {
  const { duplicates = false, rejections = false, error = 'UNKNOWN' } = options;
  return {
    data: {
      name: 'mobile-numbers.csv',
      id: '1234-2345-3456',
      status,
      error: status === 'BAD' ? error : undefined,
      duplicateEntries: duplicates ? { '0701740635': 2, '0701740605': 3 } : undefined,
      rejectedEntries: rejections ? ['07017406351', '07017406352'] : undefined,
    },
    message: 'success',
  };
};