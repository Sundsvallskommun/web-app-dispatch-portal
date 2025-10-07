import AttachmentHandler, { AttachmentFormModel } from '@components/attachment-handler/attachment-handler';
import RecipientHandler, { RecipientListFormModel } from '@components/recipient-handler/recipient-handler';
import { SenderFormModel, SenderHandler } from '@components/sender-handler/sender-handler.component';
import SubmitHandler from '@components/submit-handler/submit-handler';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMessageStore } from '@services/recipient-service';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { useTranslation } from 'next-i18next';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import FormStepper from '@components/form-stepper/form-stepper.component';
import { Mail } from 'lucide-react';
import DefaultLayout from '@layouts/default-layout/default-layout.component';
import FormStepperHeader from '@components/form-stepper/form-stepper-header.component';
import { formSchema } from './formSchema.yup';

type SendMailForm = yup.InferType<typeof formSchema>;

const initialValues = {
  attachmentList: [],
  message: '',
  recipientList: [],
  singleRecipient: '',
  subject: '',
  body: '',
  department: '',
  storeRecipients: [],
};

export interface FormModel extends AttachmentFormModel, RecipientListFormModel, SenderFormModel {}

const SendMailPage = () => {
  const [step, setStep] = useState<number>(0);
  const recipients = useMessageStore((state) => state.recipients);
  const addresses = useMessageStore((state) => state.addresses);
  const setAddresses = useMessageStore((state) => state.setAddresses);
  const setRecipients = useMessageStore((state) => state.setRecipients);
  const response = useMessageStore((state) => state.response);
  const setResponse = useMessageStore((state) => state.setResponse);
  const [success, setSuccess] = useState(false);
  const router = useRouter();
  const { t } = useTranslation(['common', 'send-mail']);

  const controls = useForm<SendMailForm>({
    resolver: yupResolver(formSchema),
    defaultValues: initialValues,
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
  });

  const { watch, reset, trigger, setValue } = controls;

  const resetAll = useCallback(() => {
    setRecipients([]);
    setAddresses([]);
    reset({ ...initialValues, department: '', subject: '' });
    setResponse(undefined);
  }, [setRecipients, setAddresses, reset, setResponse]);

  const watchAttachmentList = watch('attachmentList');
  const hasAtLeastOneAttachment = watchAttachmentList ? watchAttachmentList.length > 0 : false;

  useEffect(() => {
    if (response) {
      setSuccess(true);
      resetAll();
    }
  }, [resetAll, response, router]);

  // keep hidden field in sync with store
  useEffect(() => {
    setValue('storeRecipients', recipients ?? [], { shouldValidate: true, shouldDirty: false });
  }, [recipients, setValue]);

  const hasValidRecipients =
    recipients?.some(
      (recipient) => recipient.address && recipient?.address?.addresses?.length > 0 && !recipient.error
    ) || addresses.length > 0;

  const stepTexts: Record<number, string> = {
    0: t('common:screenReader.postStepper.stepOne'),
    1: t('common:screenReader.postStepper.stepTwo'),
    2: t('common:screenReader.postStepper.stepThree'),
  };

  const getScreenReaderStepperText = () => stepTexts[step] ?? undefined;

  const handleOnNextClick = async () => {
    const isValid = await trigger(['singleRecipient', 'recipientList', 'storeRecipients']);
    return isValid;
  };

  return (
    <DefaultLayout
      title={t('send-mail:sendLetter')}
      headerMenu={<FormStepperHeader title={t('send-mail:sendLetter')} icon={<Mail />} />}
    >
      <div className="flex items-center flex-col">
        <FormStepper<SendMailForm>
          steps={[
            {
              label: t('send-mail:addTextDocument'),
              component: <AttachmentHandler />,
              valid: hasAtLeastOneAttachment,
            },
            {
              label: t('send-mail:recipientHandler.addRecipient'),
              component: <RecipientHandler />,
              valid: hasValidRecipients,
              onNextClick: handleOnNextClick,
            },
            { label: t('send-mail:addSender'), component: <SenderHandler /> },
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

export const getServerSideProps: GetServerSideProps<object> = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'sv', ['common', 'send-mail', 'accessibility'])),
  },
});

export default SendMailPage;
