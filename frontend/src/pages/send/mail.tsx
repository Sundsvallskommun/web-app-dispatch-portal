import { useCallback, useState } from 'react';
import AttachmentHandler, { AttachmentFormModel } from '@components/attachment-handler/attachment-handler';
import RecipientHandler, { RecipientListFormModel } from '@components/recipient-handler/recipient-handler';
import { SenderFormModel, SenderHandler } from '@components/sender-handler/sender-handler.component';
import SubmitHandler from '@components/submit-handler/submit-handler';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMessageStore } from '@services/recipient-service';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { useTranslation } from 'next-i18next';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import FormStepper from '@components/form-stepper/form-stepper.component';
import { Mail } from 'lucide-react';
import DefaultLayout from '@layouts/default-layout/default-layout.component';
import FormStepperHeader from '@components/form-stepper/form-stepper-header.component';
import { formSchema } from '../../utils/formSchema.yup';
import { useMailStepValidation } from 'src/hooks/useMailStepValidation';
import { useSendMailEffects } from 'src/hooks/useSendMailEffects';
import ReviewHandler from '@components/review-handler/review-handler.component';
import { formSendType } from 'src/constants';
import { EnumQATags } from 'src/types';

export type SendMailForm = yup.InferType<typeof formSchema>;

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
  const controls = useForm<SendMailForm>({
    defaultValues: initialValues,
    mode: 'onChange',
    reValidateMode: 'onChange',
    resolver: yupResolver(formSchema),
  });
  const setAddresses = useMessageStore((state) => state.setAddresses);
  const setRecipients = useMessageStore((state) => state.setRecipients);
  const setResponse = useMessageStore((state) => state.setResponse);
  const [success, setSuccess] = useState(false);
  const { t } = useTranslation(['common', 'send-mail']);
  const { watch, reset, trigger, setValue, clearErrors } = controls;

  const resetAll = useCallback(() => {
    setRecipients([]);
    setAddresses([]);
    reset({
      ...initialValues,
      department: '',
      subject: '',
    });
    setResponse(undefined);
  }, [setRecipients, setAddresses, reset, setResponse]);

  const watchAttachmentList = watch('attachmentList');
  const hasAtLeastOneAttachment = watchAttachmentList ? watchAttachmentList.length > 0 : false;
  const hasSubject = watch('subject').length > 0;
  const hasDepartment = watch('department').length > 0;

  useSendMailEffects({ setValue, resetAll, setSuccess });

  return (
    <DefaultLayout
      title={t('send-mail:sendLetter')}
      headerMenu={
        <FormStepperHeader
          title={t('send-mail:sendLetter')}
          icon={<Mail />}
          isSuccess={success}
          helpType={EnumQATags.MAIL}
        />
      }
    >
      <div className="flex items-center flex-col">
        <FormStepper<SendMailForm>
          steps={[
            {
              label: t('common:stepper.recipient'),
              component: <RecipientHandler />,
              validationProperties: ['recipientList', 'storeRecipients'],
              onNextClick: useMailStepValidation(clearErrors, trigger, ['recipientList', 'storeRecipients']),
            },
            {
              label: t('common:stepper.files'),
              component: <AttachmentHandler />,
              valid: hasAtLeastOneAttachment,
              onNextClick: useMailStepValidation(clearErrors, trigger, ['attachmentList']),
            },
            {
              label: t('common:stepper.header'),
              component: <SenderHandler />,
              valid: hasDepartment && hasSubject,
              onNextClick: useMailStepValidation(clearErrors, trigger, ['department', 'subject']),
            },
            {
              label: t('common:stepper.review'),
              component: <ReviewHandler sendType={formSendType.MAIL} />,
              valid: true,
            },
          ]}
          submitButton={<SubmitHandler />}
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
    ...(await serverSideTranslations(locale ?? 'sv', ['common', 'send-mail', 'accessibility', 'help-menu'])),
  },
});

export default SendMailPage;
