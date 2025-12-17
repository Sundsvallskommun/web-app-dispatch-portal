import { isPersonNumber } from '@/utils/util';
import { parse } from 'csv-parse/sync';

function getHeaderData(csvContent: string, options: { delimiter: string }) {
  const rows = csvContent.split('\n').map(row => row.trim());
  const firstRow = rows[0]?.split(options.delimiter) ?? [];
  return { hasHeader: !isPersonNumber(firstRow[0]), firstRow, rows };
}

export const checkCsv: (file: Express.Multer.File) => boolean = file => {
  const base64String = file.buffer.toString('base64');
  const input = Buffer.from(base64String, 'base64').toString('utf-8');
  const { hasHeader, rows } = getHeaderData(input, { delimiter: ';' });
  const cleanRows = hasHeader ? rows.slice(1, -1) : rows;
  return cleanRows.filter(row => !!row.trim()).every(row => isPersonNumber(row));
};

export const parseCsv: (file: Express.Multer.File) => any[] = file => {
  const base64String = file.buffer.toString('base64');
  const input = Buffer.from(base64String, 'base64').toString('utf-8');
  const { hasHeader, firstRow } = getHeaderData(input, { delimiter: ';' });
  return parse(input, {
    delimiter: ';',
    columns: hasHeader
      ? record => record.map((column, idx) => (idx === 0 ? 'personnumber' : column.trim()))
      : ['personnumber', ...firstRow.slice(1)],
    skip_records_with_empty_values: true,
    skip_empty_lines: true,
  });
};
