import * as yup from 'yup';

export const esigningFormSchema = yup
  .object({
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
