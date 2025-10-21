import FormStepperHeader from '@components/form-stepper/form-stepper-header.component';
import SuccessContainer from '@components/success-container/success-container';
import { yupResolver } from '@hookform/resolvers/yup';
import { SMSRequest, SMSStatus } from '@interfaces/sms';
import DefaultLayout from '@layouts/default-layout/default-layout.component';
import { ApiResponse, apiService } from '@services/api-service';
import {
  Button,
  Chip,
  Divider,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Icon,
  Input,
  Textarea,
  useSnackbar,
} from '@sk-web-gui/react';
import { SendHorizontal, Smartphone } from 'lucide-react';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

const phoneNumberRegex = /^\+46[0-9]{7,13}$/;

const formSchema = yup
  .object({
    message: yup.string().min(3, 'Du måste skriva ett meddelande med minst 3 tecken'),
    recipientList: yup.array().test('HAS_MIN_ONE', 'Du måste ha minst en mottagare', (value) => {
      return value && value.length > 0;
    }),
  })
  .required();

const initialValues = {
  country: '0',
  message: '',
  singleRecipient: '',
  recipientList: [],
};

export interface FormModel {
  country: string;
  message: string;
  singleRecipient: string;
  recipientList: string[];
}

export default function SendEmailPage() {
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const message = useSnackbar();

  const controls = useForm<Partial<FormModel>>({
    resolver: yupResolver(formSchema),
    values: initialValues,
    mode: 'onChange', // NOTE: Needed if we want to disable submit until valid
    reValidateMode: 'onChange',
  });

  const {
    watch,
    handleSubmit,
    setValue,
    getValues,
    register,
    reset,
    formState: { errors },
  } = controls;

  const recipientList = watch('recipientList');

  const handleRemove = (recipient: string) => {
    const recipients = getValues('recipientList');
    setValue(
      'recipientList',
      recipients?.filter((item) => item !== recipient)
    );
  };

  const addRecipient = () => {
    setError('');
    const recipients = getValues('recipientList') ?? [];
    const recipientValue = getValues('singleRecipient');
    if (!recipientValue) {
      return;
    }

    const recipient = recipientValue.replace(/^0/, '+46').replaceAll('-', '').replaceAll(' ', '');

    setValue('singleRecipient', recipient);

    const alreadyExists = recipients ? recipients?.indexOf(recipient) : 0;

    if (alreadyExists >= 0) {
      setError('Numret är redan tillagt!');
      return;
    }

    if (!recipient.match(phoneNumberRegex)) {
      setError('Formatet på telefonnumret är felaktigt');
      return;
    }
    setValue('singleRecipient', initialValues.singleRecipient);
    setValue('recipientList', [...recipients, recipient]);
  };

  const resetAll = async () => {
    setTimeout(() => {
      reset(initialValues);
    }, 1);
    setSuccess(false);
  };

  const onSubmit = async (formData: Partial<FormModel>) => {
    if (!formData.recipientList || !formData.message) {
      return;
    }

    setIsSending(true);

    const data = {
      message: formData.message,
      recipients: formData.recipientList,
    };

    const res = await apiService.post<ApiResponse<SMSStatus>, SMSRequest>(`sms`, data).catch((e) => {
      setSuccess(false);
      message({ message: 'Något gick fel', status: 'error' });
      console.error('Something went wrong when sending sms:', e);
      throw e;
    });

    if (res?.data?.data?.batchId) {
      setSuccess(true);
      message({ message: 'SMS skickades', status: 'success' });
      // NOTE: fix for textarea (message) to update
      setTimeout(() => {
        reset(initialValues);
      }, 1);
    }

    setIsSending(false);
  };

  const handleSendNew = () => {
    resetAll();
    setSuccess(false);
  };

  return (
    <DefaultLayout
      title={`Postportalen`}
      headerMenu={<FormStepperHeader title="Skicka Sms" icon={<Smartphone />} isSuccess={success} />}
    >
      <h1 className="sr-only">Skicka SMS</h1>
      <div className="text-lg mb-11">
        {success ? (
          <SuccessContainer
            onClick={handleSendNew}
            title="Ditt sms är skickat"
            message="Du kan granska utskicket under <strong>Dina utskick</strong> på startsidan."
            sendNewBtntext="Skicka nytt sms"
          />
        ) : (
          <div className="w-full max-w-[82rem] mx-auto">
            <h2 className="text-h4-lg">Skicka sms</h2>
            <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
              <div className="w-full flex justify-center">
                <div className="mt-24 flex flex-col items-start w-full shadow-50 p-32 rounded-14">
                  <div className="w-full">
                    <h4 className="pb-6 text-lead">Lägg till mottagare och meddelande</h4>
                    <Divider className="w-full" orientation="horizontal" strong={false} />
                  </div>
                  <div className="w-full flex flex-col gap-xl mt-56">
                    <div>
                      <div className="flex gap-16 max-w-sm">
                        <FormControl invalid={!!error} id="recipient" className="flex-grow" size="md">
                          <FormLabel className="text-label-medium">Mottagarens mobilnummer</FormLabel>
                          <Input {...register('singleRecipient')} placeholder="+46" />
                        </FormControl>

                        <Button
                          className="self-end"
                          variant="tertiary"
                          onClick={() => {
                            addRecipient();
                          }}
                        >
                          Lägg till
                        </Button>
                      </div>

                      <div>{error && <FormErrorMessage className="my-8">{error}</FormErrorMessage>}</div>
                    </div>
                    <div className="">
                      <h3 className="pb-16 text-label-medium">Tillagda mottagare</h3>
                      <div className="flex flex-col items-start gap-6">
                        {recipientList?.map((recipient) => (
                          <Chip className="" onClick={() => handleRemove(recipient)} key={recipient}>
                            {recipient}
                          </Chip>
                        ))}
                      </div>
                      {errors?.recipientList && (
                        <FormErrorMessage key={`recipientList-errors`}>
                          {errors.recipientList?.message}
                        </FormErrorMessage>
                      )}
                    </div>

                    <FormControl invalid={!!errors?.message} id="message" className="w-full" size="md">
                      <FormLabel className="text-label-medium">Meddelande</FormLabel>
                      <Textarea
                        className="w-full min-h-[17rem]"
                        showCount={true}
                        maxLength={459}
                        {...register('message')}
                      />
                    </FormControl>

                    {errors.message && (
                      <FormErrorMessage key={`message-errors`}>{errors.message?.message}</FormErrorMessage>
                    )}
                  </div>
                </div>
              </div>
              <Button
                type="submit"
                color="vattjom"
                className="mt-16 self-end"
                rightIcon={<Icon icon={<SendHorizontal />} />}
                loading={isSending}
              >
                Skicka sms
              </Button>
            </form>
          </div>
        )}
      </div>
    </DefaultLayout>
  );
}

export const getServerSideProps: GetServerSideProps<object> = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'sv', ['common', 'accessibility'])),
  },
});
