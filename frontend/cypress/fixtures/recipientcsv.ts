import { CsvApiResponse } from 'src/data-contracts/backend/data-contracts';

export const recipientcsv = (status: 'OK' | 'BAD'): CsvApiResponse => ({
  data: {
    name: 'personal-numbers.csv',
    id: '1234-2345-3456',
    status,
  },
  message: 'success',
});
