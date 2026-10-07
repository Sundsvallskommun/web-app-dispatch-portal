import * as yup from 'yup';

export const esigningFormSchema = yup
  .object({
    subject: yup.string().required('send-esigning:attachmentHandler.errors.noSubject'),
    signatoryDocument: yup
      .array()
      .default([])
      .min(1, 'send-esigning:attachmentHandler.errors.noSigningDocument')
      .max(1, 'send-esigning:attachmentHandler.errors.oneSigningDocument'),
    attachmentList: yup.array().default([]),
    signatories: yup
      .array()
      .of(
        yup.object({
          partyId: yup.string(),
          name: yup.string().required(),
          email: yup.string().required(),
          personNumber: yup.string().default(''),
        })
      )
      .default([])
      .min(1, 'send-esigning:recipientHandler.errors.noSignatory'),
  })
  .required();

export type SendEsigningForm = yup.InferType<typeof esigningFormSchema>;
