import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import SubmitHandler from '@components/submit-handler/submit-handler';
import FormStepper from '@components/form-stepper/form-stepper.component';
import { MailCheck } from 'lucide-react';
import RecipientHandler from '@components/recipient-handler/recipient-handler';

const formSchema = yup
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

type SendRekMailForm = yup.InferType<typeof formSchema>;

const initialValues = {
  attachmentList: [],
  message: '',
  recipientList: [],
  singleRecipient: '',
  subject: '',
  body: '',
  department: '',
};

const SendRekMail = () => {
  const [success, setSuccess] = useState(false);
  const [step, setStep] = useState<number>(0);
  const controls = useForm<SendRekMailForm>({
    defaultValues: initialValues,
    mode: 'onChange',
    reValidateMode: 'onChange',
  });
  const { watch, trigger } = controls;
  const watchAttachmentList = watch('attachmentList');
  const hasAtLeastOneAttachment = watchAttachmentList ? watchAttachmentList.length > 0 : false;
  const { t } = useTranslation(['common', 'send-mail']);

  const stepTexts: Record<number, string> = {
    0: t('common:screenReader.postStepper.stepOne'),
  };

  const getScreenReaderStepperText = () => stepTexts[step] ?? undefined;

  const stepContent = <div>Content</div>;

  return (
    <FormStepper<SendRekMailForm>
      steps={[
        {
          label: t('send-mail:recipientHandler.addRecipient'),
          component: <RecipientHandler />,
          valid: true,
          onNextClick: () => {
            trigger(['singleRecipient', 'recipientList', 'storeRecipients']);
          },
        },
        {
          label: 'Bifoga filer',
          component: <div>Test</div>,
          valid: true,
        },
        {
          label: 'Ange ämne och förvaltning',
          component: <div>Test</div>,
          valid: true,
        },
        {
          label: 'Granska',
          component: <div>Test</div>,
          valid: true,
        },
      ]}
      onChangeStep={setStep}
      submitButton={<SubmitHandler />}
      getScreenReaderStepperText={getScreenReaderStepperText}
      controls={controls}
      headerTitle={t('send-mail:sendRecLetter')}
      success={success}
      onResetSuccess={() => setSuccess(false)}
      icon={<MailCheck />}
    />
  );
};

export const getStaticProps: GetServerSideProps<object> = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'sv', ['common', 'send-mail', 'accessibility'])),
  },
});

export default SendRekMail;
