import { isPersonNumber } from '@/utils/util';
import { parse } from 'csv-parse/sync';

function getHeaderData(csvContent: string, options: { delimiter: string }) {
  const rows = csvContent.split('\n').map(row => row.trim());
  const firstRow = rows[0]?.split(options.delimiter) ?? [];
  return { hasHeader: !isPersonNumber(firstRow[0]), firstRow: firstRow };
}

export const parseCsv: (input: string) => any[] = input => {
  const { hasHeader, firstRow } = getHeaderData(input, { delimiter: ';' });
  return parse(input, {
    delimiter: ';',
    columns: hasHeader ? record => record.map((column, idx) => (idx === 0 ? 'personnumber' : column.trim())) : ['personnumber', ...firstRow.slice(1)],
    skip_records_with_empty_values: true,
    skip_empty_lines: true,
  });
};
