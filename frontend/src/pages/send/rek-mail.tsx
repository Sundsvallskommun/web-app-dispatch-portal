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
import { formSendType } from 'src/constants';
import { formSchema } from './formSchema.yup';

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
  const { trigger, setValue, reset } = controls;
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

  const handleOnNextClick = async () => {
    const isValid = await trigger(['singleRecipient', 'recipientList', 'storeRecipients']);

    if (!recipients?.length && isValid) {
      controls.setError('storeRecipients', {
        type: 'manual',
        message: t('send-mail:recipientHandler:errorHandler.singleRecipientError'),
      });
      return false;
    }

    return isValid;
  };

  return (
    <DefaultLayout
      title={t('start-page:app-title')}
      headerMenu={<FormStepperHeader title={t('send-mail:sendRecLetter')} icon={<MailCheck />} />}
    >
      <div className="flex items-center flex-col">
        <FormStepper<SendRekMailForm>
          steps={[
            {
              label: t('common:stepper.recipient'),
              component: <RecipientHandler sendType={formSendType.REK_MAIL} />,
              valid: hasValidRecipients,
              onNextClick: handleOnNextClick,
            },
            {
              label: t('common:stepper.files'),
              component: <>Filer</>, // To Do: lägg till korrekt komponent
              valid: true,
            },
            {
              label: t('common:stepper.header'),
              component: <>Rubrik och förvaltning</>, // To Do: lägg till korrekt komponent
              valid: true,
            },
            {
              label: t('common:stepper.review'),
              component: <>Granska</>, // To Do: lägg till korrekt komponent
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
