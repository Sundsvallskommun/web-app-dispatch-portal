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
import { formSendType } from 'src/constants';
import { formSchema } from '../../utils/formSchema.yup';
import AttachmentHandler from '@components/attachment-handler/attachment-handler';
import { hasValidRecipients } from '@utils/hasValidRecipients';
import { useMailStepValidation } from 'src/hooks/useMailStepValidation';
import { SenderHandler } from '@components/sender-handler/sender-handler.component';
import { yupResolver } from '@hookform/resolvers/yup';
import { useSendMailEffects } from 'src/hooks/useSendMailEffects';
import ReviewHandler from '@components/review-handler/review-handler.component';
import { EnumQATags } from 'src/types';
import { useRouter } from 'next/router';
import { useUserStore } from '@services/user-service/user-service';

export type SendRekMailForm = yup.InferType<typeof formSchema>;

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
  const controls = useForm<SendRekMailForm>({
    defaultValues: initialValues,
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: yupResolver(formSchema),
  });
  const { trigger, reset, watch, setValue, clearErrors } = controls;
  const [success, setSuccess] = useState(false);
  const [step, setStep] = useState<number>(0);
  const recipients = useMessageStore((state) => state.recipients);
  const setRecipients = useMessageStore((state) => state.setRecipients);
  const addresses = useMessageStore((state) => state.addresses);
  const setAddresses = useMessageStore((state) => state.setAddresses);
  const setResponse = useMessageStore((state) => state.setResponse);
  const watchAttachmentList = watch('attachmentList');
  const hasSubject = watch('subject').length > 0;
  const hasDepartment = watch('department').length > 0;
  const hasAtLeastOneAttachment = (watchAttachmentList?.length ?? 0) > 0;
  const { t } = useTranslation(['common', 'send-mail']);
  const router = useRouter();
  const { user } = useUserStore();

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
    if (!user.permissions.canSendRegisteredLetter) router.replace('/');
  }, [user.permissions.canSendRegisteredLetter, router]);

  useSendMailEffects({ setValue, resetAll, setSuccess });

  const recipientHandlerOnNextClick = useMailStepValidation(clearErrors, trigger, [
    'singleRecipient',
    'recipientList',
    'storeRecipients',
  ]);
  const attachmentHandlerOnNextClick = useMailStepValidation(clearErrors, trigger, ['attachmentList']);
  const senderHandlerOnNextClick = useMailStepValidation(clearErrors, trigger, ['department', 'subject']);

  if (!user.permissions.canSendRegisteredLetter) return null;

  return (
    <DefaultLayout
      title={t('send-mail:sendRecLetter')}
      headerMenu={
        <FormStepperHeader
          title={t('send-mail:sendRecLetter')}
          icon={<MailCheck />}
          isSuccess={success}
          helpType={EnumQATags.REK_MAIL}
        />
      }
    >
      <div className="flex items-center flex-col">
        <FormStepper<SendRekMailForm>
          steps={[
            {
              label: t('common:stepper.recipient'),
              component: <RecipientHandler sendType={formSendType.REK_MAIL} />,
              valid: hasValidRecipients(recipients, addresses),
              onNextClick: recipientHandlerOnNextClick,
            },
            {
              label: t('common:stepper.files'),
              component: <AttachmentHandler />,
              valid: hasAtLeastOneAttachment,
              onNextClick: attachmentHandlerOnNextClick,
            },
            {
              label: t('common:stepper.header'),
              component: <SenderHandler />,
              valid: hasDepartment && hasSubject,
              onNextClick: senderHandlerOnNextClick,
            },
            {
              label: t('common:stepper.review'),
              component: <ReviewHandler sendType={formSendType.REK_MAIL} />,
              valid: true,
            },
          ]}
          onChangeStep={setStep}
          submitButton={<SubmitHandler sendType={formSendType.REK_MAIL} />}
          getScreenReaderStepperText={getScreenReaderStepperText}
          controls={controls}
          success={success}
          onResetSuccess={() => setSuccess(false)}
          sendType={formSendType.REK_MAIL}
        />
      </div>
    </DefaultLayout>
  );
};

export const getStaticProps: GetServerSideProps<object> = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'sv', ['common', 'send-mail', 'accessibility', 'help-menu'])),
  },
});

export default SendRekMail;
