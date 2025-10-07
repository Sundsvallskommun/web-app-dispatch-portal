import * as yup from 'yup';

export const formSchema = yup
  .object({
    message: yup.string().nullable(),
    department: yup.string().required(),
    subject: yup.string().required(),
    body: yup.string().nullable(),
    attachmentList: yup.array().test('HAS_MIN_ONE', 'Du måste bifoga ett dokument', (value) => {
      return value && value.length > 0;
    }),
    recipientList: yup.array(),
    singleRecipient: yup.string().nullable(),
    storeRecipients: yup
      .array()
      .default([])
      .test('HAS_MIN_ONE_RECIPIENT', 'Lägg till minst en mottagare för att fortsätta.', (value) => {
        return value && value.length > 0;
      }),
  })
  .required();
