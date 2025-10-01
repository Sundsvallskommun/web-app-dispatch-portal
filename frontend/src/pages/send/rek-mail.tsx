import { useCallback, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import SubmitHandler from '@components/submit-handler/submit-handler';
import FormStepper from '@components/form-stepper/form-stepper.component';
import { MailCheck } from 'lucide-react';
import RecipientHandler from '@components/recipient-handler/recipient-handler';
import DefaultLayout from '@layouts/default-layout/default-layout.component';
import FormStepperHeader from '@components/form-stepper/form-stepper-header.component';
import { useMessageStore } from '@services/recipient-service';
import { useRouter } from 'next/router';

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
  const recipients = useMessageStore((state) => state.recipients);
  const setRecipients = useMessageStore((state) => state.setRecipients);
  const addresses = useMessageStore((state) => state.addresses);
  const setAddresses = useMessageStore((state) => state.setAddresses);
  const response = useMessageStore((state) => state.response);
  const setResponse = useMessageStore((state) => state.setResponse);
  const controls = useForm<SendRekMailForm>({
    defaultValues: initialValues,
    mode: 'onChange',
    reValidateMode: 'onChange',
  });
  const { watch, trigger, setValue, reset } = controls;
  const watchAttachmentList = watch('attachmentList');
  const hasAtLeastOneAttachment = watchAttachmentList ? watchAttachmentList.length > 0 : false;
  const hasValidRecipients =
    recipients?.some(
      (recipient) => recipient.address && recipient?.address?.addresses?.length > 0 && !recipient.error
    ) || addresses.length > 0;
  const router = useRouter();
  const { t } = useTranslation(['common', 'send-mail']);

  const stepTexts: Record<number, string> = {
    0: t('common:screenReader.postStepper.stepOne'),
  };

  const getScreenReaderStepperText = () => stepTexts[step] ?? undefined;

  const resetAll = useCallback(() => {
    setRecipients([]);
    setAddresses([]);
    reset({ ...initialValues, department: '', subject: '' });
    setResponse(undefined);
  }, [setRecipients, setAddresses, reset, setResponse]);

  useEffect(() => {
    if (response) {
      setSuccess(true);
      resetAll();
    }
  }, [resetAll, response, router]);

  useEffect(() => {
    setValue('storeRecipients', recipients ?? [], { shouldValidate: true, shouldDirty: false });
  }, [recipients, setValue]);

  return (
    <DefaultLayout
      title={t('start-page:app-title')}
      headerMenu={<FormStepperHeader title={t('send-mail:sendRecLetter')} icon={<MailCheck />} />}
    >
      <div className="flex items-center flex-col">
        <FormStepper<SendRekMailForm>
          steps={[
            {
              label: t('send-mail:recipientHandler.addRecipient'),
              component: <RecipientHandler />,
              valid: hasValidRecipients,
              onNextClick: () => {
                trigger(['singleRecipient', 'recipientList', 'storeRecipients']);
              },
            },
            {
              label: 'Filer',
              component: <>Filer</>,
              valid: true,
            },
            {
              label: 'Rubrik och förvaltning',
              component: <>Rubrik och förvaltning</>,
              valid: true,
            },
            {
              label: 'Granska',
              component: <>Granska</>,
              valid: true,
            },
          ]}
          onChangeStep={setStep}
          submitButton={<SubmitHandler />}
          getScreenReaderStepperText={getScreenReaderStepperText}
          controls={controls}
          success={success}
          onResetSuccess={() => setSuccess(false)}
        />
      </div>
    </DefaultLayout>
  );
};

export const getStaticProps: GetServerSideProps<object> = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'sv', ['common', 'send-mail', 'accessibility'])),
  },
});

export default SendRekMail;
