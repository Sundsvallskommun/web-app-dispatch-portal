import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import NextLink from 'next/link';

import { Button, Icon, Link } from '@sk-web-gui/react';
import { BadgeCheck, HelpCircle, MailCheck } from 'lucide-react';
import { FormProvider, useForm } from 'react-hook-form';
import { FormStepper } from '@components/form-stepper/form-stepper.component';
import SubmitHandler from '@components/submit-handler/submit-handler';
import { HelpComposer } from '@components/help/help-composer';
import FormStepperHeader from '@components/form-stepper/form-stepper-header.component';

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
  const controls = useForm({
    values: initialValues,
    mode: 'onChange', // NOTE: Needed if we want to disable submit until valid
    reValidateMode: 'onChange',
  });
  const { watch, reset } = controls;
  const watchAttachmentList = watch('attachmentList');
  const hasAtLeastOneAttachment = watchAttachmentList ? watchAttachmentList.length > 0 : false;
  const { t } = useTranslation(['common', 'send-mail']);

  const getScreenReaderStepperText = () => {
    switch (step) {
      case 0:
        return t('screenReader.postStepper.stepOne');
      case 1:
        return t('screenReader.postStepper.stepTwo');
      case 2:
        return t('screenReader.postStepper.stepThree');
      default:
        return undefined;
    }
  };

  const stepContent = <div>Content</div>;

  const contentSuccess = (
    <div className="text-center max-w-[63rem] mx-auto">
      <Icon size="5.6rem" color="gronsta" icon={<BadgeCheck />} />
      <h2 className="mt-24">{t('send-mail:success')}</h2>
      <p className="my-md text-base">{`${t('send-mail:successInfo')}`}</p>
      <div className="flex gap-16 justify-center mt-40">
        <Button
          className="mt-lg"
          color="primary"
          variant="secondary"
          onClick={() => {
            setSuccess(false);
          }}
        >
          {t('send-mail:sendNew')}
        </Button>
        <NextLink href="/" passHref legacyBehavior>
          <Button className="mt-lg" color="vattjom">
            {t('send-mail:goBack')}
          </Button>
        </NextLink>
      </div>
    </div>
  );

  const contentFormProvider = (
    <FormProvider {...controls}>
      <FormStepper
        steps={[
          {
            label: t('send-mail:addTextDocument'),
            component: stepContent,
            valid: hasAtLeastOneAttachment,
          },
        ]}
        onChangeStep={setStep}
        submitButton={<SubmitHandler />}
      />
    </FormProvider>
  );

  return (
    <div className="flex items-center flex-col">
      <FormStepperHeader title="Skicka något" icon={<MailCheck />} />
      <h1 className="sr-only">{`${t('screenReader.sendPost')}. ${getScreenReaderStepperText()}`}</h1>
      <div className="flex flex-col max-w-[--w-max-stepper-content] w-[--w-stepper-content]">
        {success ? contentSuccess : contentFormProvider}
      </div>
    </div>
  );
};

export const getStaticProps: GetServerSideProps<object> = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'sv', ['common', 'send-mail', 'accessibility'])),
  },
});

export default SendRekMail;
