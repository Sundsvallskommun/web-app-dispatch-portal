import DefaultLayout from '@layouts/default-layout/default-layout.component';
import FormStepperHeader from '@components/form-stepper/form-stepper-header.component';
import { Pencil } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import FormStepper from '@components/form-stepper/form-stepper.component';
import { useState } from 'react';
import { esigningFormSchema, SendEsigningForm } from '@utils/esigningFormSchema.yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useEsigningStepValidation } from 'src/hooks/useEsigningStepValidation';
import EsigningRecipientHandler from '@components/recipient-handler/esigning-recipient-handler';
import EsigningAttachmentHandler from '@components/attachment-handler/esigning-attachment-handler';

const initialValues = {
  signatories: [],
  subject: '',
  signatoryDocument: [],
  attachmentList: [],
};

export default function SendEsigningPage() {
  const controls = useForm<SendEsigningForm>({
    defaultValues: initialValues,
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: yupResolver(esigningFormSchema),
  });

  const { t } = useTranslation(['common', 'send-esigning']);
  const [success, setSuccess] = useState(false);
  const { watch, trigger, clearErrors } = controls;

  const hasSignatoryDocument = (watch('signatoryDocument') ?? []).length > 0;
  const hasSubject = (watch('subject') ?? '').length > 0;

  return (
    <DefaultLayout
      title={`Postportalen`}
      headerMenu={<FormStepperHeader title={t('send-esigning:eSigning')} icon={<Pencil />} />}
    >
      <div className="flex items-center flex-col">
        <FormStepper<SendEsigningForm>
          steps={[
            {
              label: t('send-esigning:stepper.recipients'),
              component: <EsigningRecipientHandler />,
              validationProperties: ['signatories'],
              onNextClick: useEsigningStepValidation(clearErrors, trigger, ['signatories']),
            },
            {
              label: t('send-esigning:stepper.attachments'),
              component: <EsigningAttachmentHandler />,
              valid: hasSubject && hasSignatoryDocument,
              validationProperties: ['subject', 'signatoryDocument'],
              onNextClick: useEsigningStepValidation(clearErrors, trigger, ['subject', 'signatoryDocument']),
            },
          ]}
          controls={controls}
          success={success}
          onResetSuccess={() => setSuccess(false)}
        />
      </div>
    </DefaultLayout>
  );
}

export const getServerSideProps: GetServerSideProps<object> = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'sv', ['common', 'send-esigning', 'send-mail', 'help-menu'])),
  },
});
