import { parse } from 'csv-parse/sync';

export const parseCsv: (input: string) => any[] = input => {
  return parse(input, {
    delimiter: ';',
    columns: record => record.map((column, idx) => (idx === 0 ? 'personnumber' : column.trim())),
    skip_records_with_empty_values: true,
    skip_empty_lines: true,
  });
};
