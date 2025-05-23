import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import NextLink from 'next/link';
import {
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Divider,
  Button,
  Chip,
  Icon,
  Link,
  FormErrorMessage,
  useSnackbar,
} from '@sk-web-gui/react';
import * as yup from 'yup';
import DefaultLayout from '@layouts/default-layout/default-layout.component';
import { useState } from 'react';
import { SendHorizontal, HelpCircle } from 'lucide-react';
import { SMSRequest, SMSStatus } from '@interfaces/sms';
import { ApiResponse, apiService } from '@services/api-service';
import { BadgeCheck } from 'lucide-react';
import { HelpComposer } from '@components/help/help-composer';

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

  const [showHelpComposer, setShowHelpComposer] = useState(false);

  const openHelpComposer = () => setShowHelpComposer(true);
  const closeHelpComposer = () => setShowHelpComposer(false);

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

    const recipient = recipientValue
      .replace(/^0/, '+46')
      .replaceAll('-', '')
      .replaceAll(' ', '');

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

  return (
    <DefaultLayout title={`Postportalen`}>
      <HelpComposer show={showHelpComposer} closeHandler={closeHelpComposer} />
      <div className="flex flex-1 items-center justify-between bg-background-content p-40 absolute z-10 left-0 top-0 right-0">
        <NextLink href="/" passHref legacyBehavior><Link strong={true} variant="tertiary" className="text-base">Avbryt</Link></NextLink>
        <Button variant="secondary" onClick={openHelpComposer}><Icon icon={<HelpCircle />} /> Hjälp</Button>
      </div>
      <h1 className="sr-only">Skicka SMS</h1>
      <div className="text-lg mb-11 pt-48">
            {success ? (
              <div className="text-center">
                <Icon size="5.6rem" color="gronsta" icon={<BadgeCheck />} />
                <h2 className="mt-24">Ditt sms har skickats</h2>
                <p className="my-md text-base">Du kan granska utskicket under <strong>Dina utskick</strong> på startsidan.</p>
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
                    Skicka nytt sms
                  </Button>
                  <NextLink href="/" passHref legacyBehavior>
                    <Button className="mt-lg" color="vattjom">Till startsidan</Button>
                  </NextLink>
                </div>
              </div>
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
                              <Input {...register('singleRecipient')} placeholder='+46' />
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
