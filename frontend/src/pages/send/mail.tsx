import AttachmentHandler, { AttachmentFormModel } from '@components/attachment-handler/attachment-handler';
import { FormStepper } from '@components/form-stepper/form-stepper.component';
import RecipientHandler, { RecipientListFormModel } from '@components/recipient-handler/recipient-handler';
import { SenderFormModel, SenderHandler } from '@components/sender-handler/sender-handler.component';
import SubmitHandler from '@components/submit-handler/submit-handler';
import { yupResolver } from '@hookform/resolvers/yup';
import DefaultLayout from '@layouts/default-layout/default-layout.component';
import { useMessageStore } from '@services/recipient-service';
import { Button, Icon } from '@sk-web-gui/react';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import * as yup from 'yup';
import NextLink from 'next/link';
import { BadgeCheck } from 'lucide-react';
import { useTranslation } from 'next-i18next';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const RECIPIENT_ERROR = 'Lägg till minst en mottagare för att fortsätta.';

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
    // hidden field mirrored from store
    storeRecipients: yup.array().default([]),
  })
  .required()
  .test('HAS_MIN_ONE_RECIPIENT', RECIPIENT_ERROR, function (obj) {
    const single = obj?.singleRecipient?.trim?.() ?? '';
    const hasSingle = single.length > 0;
    const hasList = (obj?.recipientList?.length ?? 0) > 0;

    const storeHasValid =
      Array.isArray(obj?.storeRecipients) &&
      obj.storeRecipients.some((r) => r?.address?.addresses?.length > 0 && !r?.error);

    if (hasSingle || hasList || storeHasValid) return true;

    // 👇 force Yup to attach the error to singleRecipient
    return this.createError({
      path: 'singleRecipient',
      message: RECIPIENT_ERROR,
    });
  });

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

  const controls = useForm({
    resolver: yupResolver(formSchema),
    values: initialValues,
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
  });

  const { watch, reset, setError: setFormError, clearErrors, trigger, setValue } = controls;

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
    setValue('storeRecipients', recipients ?? [], { shouldValidate: false, shouldDirty: false });
  }, [recipients, setValue]);

  const hasValidRecipients =
    recipients?.some(
      (recipient) => recipient.address && recipient?.address?.addresses?.length > 0 && !recipient.error
    ) || addresses.length > 0;

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
  return (
    <DefaultLayout title={`Postportalen`}>
      <h1 className="sr-only">{`${t('screenReader.sendPost')}. ${getScreenReaderStepperText()}`}</h1>
      <div className="text-lg mb-11 pt-48">
        <div className="">
          <div className="">
            {success ? (
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
                      resetAll();
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
            ) : (
              <div className="w-full max-w-[82rem] mx-auto">
                <h2 className="text-h4-lg">{t('send-mail:sendLetter')}</h2>
                <FormProvider {...controls}>
                  <FormStepper
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
                        onNextClick: () => {
                          trigger(['singleRecipient', 'recipientList', 'storeRecipients']);
                        },
                      },
                      { label: t('send-mail:addSender'), component: <SenderHandler /> },
                    ]}
                    onChangeStep={setStep}
                    submitButton={<SubmitHandler />}
                  ></FormStepper>
                </FormProvider>
              </div>
            )}
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
};

export const getStaticProps: GetServerSideProps<{}> = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'sv', ['common', 'send-mail'])),
  },
});

export default SendMailPage;
