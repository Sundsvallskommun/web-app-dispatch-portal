import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Divider,
  Button,
  Chip,
  Icon,
  FormErrorMessage,
  useSnackbar,
} from '@sk-web-gui/react';
import * as yup from 'yup';
import ContentCard from '@components/content-card/content-card';
import DefaultLayout from '@layouts/default-layout/default-layout.component';
import { Help } from '@components/help/help.component';
import { useState } from 'react';
import { SendHorizontal } from 'lucide-react';
import { SMSRequest, SMSStatus } from '@interfaces/sms';
import { ApiResponse, apiService } from '@services/api-service';

const phoneNumberRegex =
  /^\+((?:9[679]|8[035789]|6[789]|5[90]|42|3[578]|2[1-689])|9[0-58]|8[1246]|6[0-6]|5[1-8]|4[013-9]|3[0-469]|2[70]|7|1)(?:\W*\d){0,13}\d$/;

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
  singleRecipient: '+46',
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

  const handleRemove = (recipient) => {
    const recipients = getValues('recipientList');
    setValue(
      'recipientList',
      recipients.filter((item) => item !== recipient)
    );
  };

  const addRecipient = () => {
    setError('');
    const recipients = getValues('recipientList');
    const recipient = getValues('singleRecipient');
    const alreadyExists = recipients.indexOf(recipient);

    if (alreadyExists >= 0) {
      setError('Numret är redan tillagt!');
      return;
    }

    if (!recipient.match(phoneNumberRegex)) {
      setError('Formatet på telefonnumret är felaktigt');
      return;
    }
    setValue('singleRecipient', initialValues.singleRecipient);
    setValue('recipientList', [...getValues('recipientList'), recipient]);
  };

  const resetAll = async () => {
    setTimeout(() => {
      reset(initialValues);
    }, 1);
    setSuccess(false);
  };

  const onSubmit = async (formData: FormModel) => {
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

  return (
    <DefaultLayout title={`Postportalen`}>
      <h1 className="sr-only">Skicka SMS</h1>
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
              <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
                <div className="w-full flex justify-center">
                  <div className="mt-40 flex flex-col items-start w-full border-1 border-divider rounded-cards gap-32">
                    <div className="w-full">
                      <h4 className="px-32 py-16">Lägg till mottagare och meddelande</h4>
                      <Divider className="w-full" orientation="horizontal" strong={false} />
                    </div>
                    <div className="w-full p-12">
                      <div className="flex gap-16">
                        <FormControl invalid={!!error} id="recipient" className="flex-grow" size="md">
                          <FormLabel>Mottagarens mobilnummer</FormLabel>
                          <Input {...register('singleRecipient')} />
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
                      <div className="py-40">
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
                        <FormLabel>Meddelande</FormLabel>
                        <Textarea
                          className="w-full min-h-44"
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
                  className="mt-16 self-end"
                  rightIcon={<Icon icon={<SendHorizontal />} />}
                  loading={isSending}
                >
                  Skicka sms
                </Button>
              </form>
            )}
          </div>
          <div className="w-full lg:w-4/12">
            <ContentCard>
              <Help show={'sms'} />
            </ContentCard>
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
}
