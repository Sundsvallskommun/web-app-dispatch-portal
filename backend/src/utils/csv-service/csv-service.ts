import FormData from 'form-data';

export const appendCsvFile = (csvFile: Express.Multer.File, fieldName: string, formdata: FormData) => {
  const csvContentType = 'text/csv';

  if (csvFile.mimetype !== csvContentType) {
    throw new Error('Wrong csv file mimetype; must be text/csv');
  }

  if (!Buffer.isBuffer(csvFile.buffer)) {
    // eslint-disable-next-line no-explicit-any
    csvFile.buffer = Buffer.from((csvFile.buffer as any).data);
    if (!Buffer.isBuffer(csvFile.buffer)) {
      throw new TypeError('Csv file buffer missing');
    }
  }
  formdata.append(fieldName, csvFile.buffer, {
    filename: csvFile.originalname,
    contentType: csvContentType,
  });
};
