import AttachmentHandler, { AttachmentFormModel } from '@components/attachment-handler/attachment-handler';
import { FormStepper } from '@components/form-stepper/form-stepper.component';
import RecipientHandler, { RecipientListFormModel } from '@components/recipient-handler/recipient-handler';
import { SenderFormModel, SenderHandler } from '@components/sender-handler/sender-handler.component';
import SubmitHandler from '@components/submit-handler/submit-handler';
import { yupResolver } from '@hookform/resolvers/yup';
import DefaultLayout from '@layouts/default-layout/default-layout.component';
import { useMessageStore } from '@services/recipient-service';
import { useUserStore } from '@services/user-service/user-service';
import { Button, Icon } from '@sk-web-gui/react';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import * as yup from 'yup';
import NextLink from 'next/link';
import { BadgeCheck } from 'lucide-react';

const formSchema = yup
  .object({
    message: yup.string(),
    department: yup.string(),
    subject: yup.string(),
    body: yup.string(),
    attachmentList: yup.array().test('HAS_MIN_ONE', 'Du måste bifoga ett dokument', (value) => {
      return value && value.length > 0;
    }),
    recipientList: yup.array(),
  })
  .required();

const initialValues = {
  attachmentList: [],
  message: '',
  recipientList: [],
  singleRecipient: '',
  subject: '',
  body: '',
  department: '',
};

export interface FormModel extends AttachmentFormModel, RecipientListFormModel, SenderFormModel {}

export default function SendMailPage() {
  const [step, setStep] = useState<number>(0);
  const recipients = useMessageStore((state) => state.recipients);
  const addresses = useMessageStore((state) => state.addresses);
  const setAddresses = useMessageStore((state) => state.setAddresses);
  const setRecipients = useMessageStore((state) => state.setRecipients);
  const response = useMessageStore((state) => state.response);
  const setResponse = useMessageStore((state) => state.setResponse);
  const [success, setSuccess] = useState(false);
  const user = useUserStore((state) => state.user);
  const router = useRouter();

  const myDepartment = user?.orgTree
    ? user.orgTree
        .split('¤')
        ?.find((dep) => dep.charAt(0) === '2')
        ?.split('|')[2]
    : '';

  const controls = useForm<Partial<FormModel>>({
    resolver: yupResolver(formSchema),
    values: initialValues,
    mode: 'onChange', // NOTE: Needed if we want to disable submit until valid
    reValidateMode: 'onChange',
  });

  const { watch, reset, setValue } = controls;

  useEffect(() => {
    if (myDepartment) {
      setValue('department', myDepartment, { shouldDirty: false, shouldValidate: false });
    }
  }, [myDepartment, setValue]);

  const resetAll = useCallback(() => {
    setRecipients([]);
    setAddresses([]);
    reset({ ...initialValues, department: myDepartment, subject: `Utskick från ${myDepartment}` });
    setResponse(undefined);
  }, [myDepartment, reset, setRecipients, setResponse, setAddresses]);

  const watchAttachmentList = watch('attachmentList');
  const hasAtLeastOneAttachment = watchAttachmentList ? watchAttachmentList.length > 0 : false;

  useEffect(() => {
    if (response) {
      // router.push(`/status/${response.response.batchId}`);
      setSuccess(true);
      resetAll();
    }
  }, [resetAll, response, router]);

  const hasValidRecipients = recipients?.some(
    (recipient) => recipient.address && recipient?.address?.addresses?.length > 0 && !recipient.error
  ) || addresses.length > 0;

  return (
    <DefaultLayout title={`Postportalen`}>
      <h1 className="sr-only">
        Skicka post.{' '}
        {step === 0
          ? 'Steg 1: Lägg till textdokument'
          : step === 1
            ? 'Steg 2: Lägg till mottagare'
            : step === 2
              ? 'Steg 3: Ange avsändare'
              : undefined}
      </h1>
      <div className="text-lg mb-11 pt-48">
        <div className="">
          <div className="">
            {success ? (
              <div className="text-center max-w-[63rem] mx-auto">
              <Icon size="5.6rem" color="gronsta" icon={<BadgeCheck />} />
              <h2 className="mt-24">Ditt brev har skickats</h2>
              <p className="my-md text-base">Brevet skickas digitalt till mottagare med en digital brevlåda. De som saknar en får brevet som vanlig post. Du kan granska och och se status för utskicket under <strong>Dina utskick</strong> på startsidan.</p>
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
                  Skicka nytt brev
                </Button>
                <NextLink href="/" passHref legacyBehavior>
                  <Button className="mt-lg" color="vattjom">Till startsidan</Button>
                </NextLink>
              </div>
            </div>
            ) : (
              <div className="w-full max-w-[82rem] mx-auto">
              <h2 className="text-h4-lg">Skicka brev</h2>
              <FormProvider {...controls}>
                <FormStepper
                  steps={[
                    {
                      label: 'Lägg till textdokument',
                      component: <AttachmentHandler />,
                      valid: hasAtLeastOneAttachment,
                    },
                    { label: 'Lägg till mottagare', component: <RecipientHandler />, valid: hasValidRecipients },
                    { label: 'Ange avsändare', component: <SenderHandler /> },
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
}
