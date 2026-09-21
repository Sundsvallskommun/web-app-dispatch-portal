import DefaultLayout from '@layouts/default-layout/default-layout.component';
import FormStepperHeader from '@components/form-stepper/form-stepper-header.component';
import { Pencil } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import FormStepper from '@components/form-stepper/form-stepper.component';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useUserStore } from '@services/user-service/user-service';
import { esigningFormSchema, SendEsigningForm } from '@utils/esigningFormSchema.yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { useEsigningStepValidation } from 'src/hooks/useEsigningStepValidation';
import EsigningRecipientHandler from '@components/recipient-handler/esigning-recipient-handler';
import EsigningAttachmentHandler from '@components/attachment-handler/esigning-attachment-handler';
import EsigningReviewHandler from '@components/review-handler/esigning-review-handler.component';
import EsigningSubmitHandler from '@components/submit-handler/esigning-submit-handler';
import { formSendType } from 'src/constants';

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
  const { watch, trigger, clearErrors, reset } = controls;
  const router = useRouter();
  const { user } = useUserStore();

  const hasSignatoryDocument = (watch('signatoryDocument') ?? []).length > 0;
  const hasSubject = (watch('subject') ?? '').length > 0;

  const recipientHandlerOnNextClick = useEsigningStepValidation(clearErrors, trigger, ['signatories']);
  const attachmentHandlerOnNextClick = useEsigningStepValidation(clearErrors, trigger, [
    'subject',
    'signatoryDocument',
  ]);

  useEffect(() => {
    if (!user.permissions.canSendEsigning) router.replace('/');
  }, [user.permissions.canSendEsigning, router]);

  if (!user.permissions.canSendEsigning) return null;

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
              onNextClick: recipientHandlerOnNextClick,
            },
            {
              label: t('send-esigning:stepper.attachments'),
              component: <EsigningAttachmentHandler />,
              valid: hasSubject && hasSignatoryDocument,
              onNextClick: attachmentHandlerOnNextClick,
            },
            {
              label: t('send-esigning:stepper.review'),
              component: <EsigningReviewHandler />,
              valid: true,
            },
          ]}
          submitButton={<EsigningSubmitHandler onSuccess={() => setSuccess(true)} />}
          controls={controls}
          success={success}
          onResetSuccess={() => {
            reset(initialValues);
            setSuccess(false);
          }}
          sendType={formSendType.ESIGNING}
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
