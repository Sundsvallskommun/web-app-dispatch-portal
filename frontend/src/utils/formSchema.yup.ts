import * as yup from 'yup';

export const formSchema = yup
  .object({
    message: yup.string().nullable(),
    department: yup.string().required('send-mail:senderHandler.error.noDepartment'),
    subject: yup.string().required('send-mail:senderHandler.error.noSubject'),
    body: yup.string().nullable(),
    attachmentList: yup.array().test('HAS_MIN_ONE', 'send-mail:attachmentHandler.errorMessage', (value) => {
      return value && value.length > 0;
    }),
    recipientList: yup
      .array()
      .test('HAS_MIN_ONE_FILE', 'send-mail:recipientHandler.errorHandler.csvError', (value, yupObject) => {
        return yupObject?.parent?.storeRecipients?.length > 0 || (value && value.length > 0);
      }),
    singleRecipient: yup.string().nullable(),
    storeRecipients: yup
      .array()
      .default([])
      .test(
        'HAS_MIN_ONE_RECIPIENT',
        'send-mail:recipientHandler.errorHandler.singleRecipientError',
        (value, yupObject) => {
          return yupObject?.parent?.recipientList?.length > 0 || (value && value.length > 0);
        }
      ),
  })
  .required();
