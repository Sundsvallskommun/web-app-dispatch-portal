import AttachmentHandler, { AttachmentFormModel } from '@components/attachment-handler/attachment-handler';
import ContentCard from '@components/content-card/content-card';
import { FormStepper } from '@components/form-stepper/form-stepper.component';
import { Help } from '@components/help/help.component';
import RecipientHandler, { RecipientListFormModel } from '@components/recipient-handler/recipient-handler';
import { SenderFormModel, SenderHandler } from '@components/sender-handler/sender-handler.component';
import SubmitHandler from '@components/submit-handler/submit-handler';
import { yupResolver } from '@hookform/resolvers/yup';
import DefaultLayout from '@layouts/default-layout/default-layout.component';
import { useMessageStore } from '@services/recipient-service';
import { useUserStore } from '@services/user-service/user-service';
import { Button } from '@sk-web-gui/react';
import { useRouter } from 'next/router';
import { useCallback, useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import * as yup from 'yup';

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

export default function Index() {
  const [step, setStep] = useState<number>(0);
  const recipients = useMessageStore((state) => state.recipients);
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
    reset({ ...initialValues, department: myDepartment, subject: `Utskick från ${myDepartment}` });
    setResponse(undefined);
  }, [myDepartment, reset, setRecipients, setResponse]);

  const hasAtLeastOneAttachment = watch('attachmentList').length > 0;

  useEffect(() => {
    if (response) {
      // router.push(`/status/${response.response.batchId}`);
      setSuccess(true);
      resetAll();
    }
  }, [resetAll, response, router]);

  const hasValidRecipients = recipients?.some(
    (recipient) => recipient.address && recipient?.address?.addresses?.length > 0 && !recipient.error
  );

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
        <div className="flex flex-row gap-32 lg:gap-48 xl:gap-80 flex-wrap lg:flex-nowrap justify-between">
          <div className="w-full lg:w-7/12">
            {success ? (
              <>
                <h2>Klart!</h2>
                <p className="my-md text-base">Ditt utskick har gjorts.</p>
                <Button
                  className="mt-lg"
                  color="vattjom"
                  onClick={() => {
                    resetAll();
                    setSuccess(false);
                  }}
                >
                  Gör ett nytt utskick
                </Button>
              </>
            ) : (
              <div>
                <div className="w-full mb-lg p-md bg-inverted-warning rounded text-inverted-warning-background-100 text-base">
                  Störningar kan just nu förekomma i Postportalen.
                </div>
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
          <div className="w-full lg:w-4/12">
            <ContentCard>
              <Help show={step === 0 ? 'documents' : step === 1 ? 'recipients' : step === 2 ? 'sender' : undefined} />
            </ContentCard>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
}
