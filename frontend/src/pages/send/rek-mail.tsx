import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useForm } from 'react-hook-form';
import SubmitHandler from '@components/submit-handler/submit-handler';
import FormStepper from '@components/form-stepper/form-stepper.component';

interface SendRekMailForm {
  attachmentList: any[];
  message: string;
  recipientList: any[];
  singleRecipient: string;
  subject: string;
  body: string;
  department: string;
}

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
  const { watch } = controls;
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
          label: t('send-mail:addTextDocument'),
          component: stepContent,
          valid: hasAtLeastOneAttachment,
        },
      ]}
      onChangeStep={setStep}
      submitButton={<SubmitHandler />}
      getScreenReaderStepperText={getScreenReaderStepperText}
      controls={controls}
      headerTitle={t('send-mail:sendRecLetter')}
      success={success}
      onResetSuccess={() => setSuccess(false)}
    />
  );
};

export const getStaticProps: GetServerSideProps<object> = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'sv', ['common', 'send-mail', 'accessibility'])),
  },
});

export default SendRekMail;
