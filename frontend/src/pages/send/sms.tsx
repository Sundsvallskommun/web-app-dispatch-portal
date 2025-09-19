import { HelpComposer } from '@components/help/help-composer';
import { yupResolver } from '@hookform/resolvers/yup';
import { SMSRequest, SMSStatus } from '@interfaces/sms';
import DefaultLayout from '@layouts/default-layout/default-layout.component';
import { useMediaQuery } from '@mui/material';
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
  Link,
  Textarea,
  useGui,
  useSnackbar,
} from '@sk-web-gui/react';
import { BadgeCheck, HelpCircle, SendHorizontal, Smartphone, Trash } from 'lucide-react';
import NextLink from 'next/link';
import { useEffect, useState } from 'react';
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
  const gui = useGui();
  const isMedium = useMediaQuery(`screen and (min-width:${gui.theme?.screens?.md})`);

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
  const messageText = watch('message');
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

  const formatSwedishNumberDisplay = (num: string): string => {
    // num is like "+46762468709"
    const digits = num.replace(/\D/g, '');

    // remove the +46 prefix for formatting
    if (!digits.startsWith('46')) return num; // fallback if not Swedish

    const rest = digits.slice(2); // e.g. "762468709"

    return rest.replace(/^(\d{2})(\d{3})(\d{2})(\d{2})$/, '+46 $1-$2 $3 $4');
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
    <div className="main-wrapper">
      <HelpComposer show={showHelpComposer} closeHandler={closeHelpComposer} />
      <div className="flex flex-row items-center justify-between self-stretch bg-background-content px-80 py-16 border-b-1 border-divider ">
        <NextLink href="/" passHref className="w-100 text-dark-primary">
          <Link strong={true} variant="tertiary" className="text-base">
            Avbryt
          </Link>
        </NextLink>
        {isMedium && (
          <div className="lg:w-818 flex flex-row items-center justify-start">
            <Icon icon={<Smartphone />} className="w-28 h-28 mr-12" />
            <div className="text-h4-lg text-dark-primary">Skicka sms</div>
          </div>
        )}
        <Button variant="secondary" onClick={openHelpComposer}>
          <Icon icon={<HelpCircle />} className="text-dark-primary h-18 w-18" />
          <div className="text-dark-secondary text-label-medium lining-nums proportional-nums">Hjälp</div>
        </Button>
      </div>
      <div className="main-container">
        <div className="container">
          <h1 className="sr-only">Skicka SMS</h1>
          <div className="text-lg pb-40 flex flex-col justify-start items-center gap-56 self-stretch">
            {success ? (
              <div className="text-center">
                <Icon size="5.6rem" color="gronsta" icon={<BadgeCheck />} />
                <h2 className="mt-24">Ditt sms har skickats</h2>
                <p className="my-md text-base">
                  Du kan granska utskicket under <strong>Dina utskick</strong> på startsidan.
                </p>
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
                    <Button className="mt-lg" color="vattjom">
                      Till startsidan
                    </Button>
                  </NextLink>
                </div>
              </div>
            ) : (
              <form
                className="flex flex-col items-start gap-24 flex-1 w-full max-w-818"
                onSubmit={handleSubmit(onSubmit)}
              >
                <div className="flex flex-col items-start gap-56 self-stretch p-32 w-full shadow-50 rounded-groups">
                  <div className="flex flex-col items-start gap-12 self-stretch w-full">
                    <div className="flex flex-col pb-6 items-start gap-6 self-stretch text-label-medium font-normal text-dark-primary">
                      Någon info ?
                    </div>
                    <Divider className="w-full" orientation="horizontal" strong={false} />
                  </div>
                  <div className="flex flex-col gap-56 items-start self-stretch">
                    <div>
                      <div className="flex max-w-382 flex-col items-start gap-16">
                        <div className="flex flex-col items-start gap-8 self-stretch w-full">
                          <FormControl invalid={!!error} id="recipient" className="flex-grow w-full" size="md">
                            <FormLabel className="text-label-medium text-dark-primary lining-nums proportional-nums w-full">
                              Lägg till mottagaren (mobilnummer)
                            </FormLabel>
                            <div className="flex justify-end items-end gap-16 self-stretch flex-wrap w-full">
                              <Input
                                className="flex items-center gap-8 flex-1 w-full min-w-249"
                                {...register('singleRecipient')}
                              />
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
                          </FormControl>
                        </div>
                      </div>

                      <div>{error && <FormErrorMessage className="my-8">{error}</FormErrorMessage>}</div>
                    </div>
                    <div className="flex flex-col items-start gap-12 self-stretch">
                      <div className="flex flex-col items-start gap-12 self-stretch">
                        <div className="text-label-medium text-dark-primary lining-nums proportional-nums">
                          Tillagda mottagare
                        </div>
                        {recipientList && recipientList.length > 0 ? (
                          <div className="flex flex-col justify-center items-start gap-8">
                            {recipientList?.map((recipient) => (
                              // <Chip className="" onClick={() => handleRemove(recipient)} key={recipient}>
                              //   {recipient}
                              // </Chip>
                              <button
                                className="border-spacing-1 border-1 border-secondary-outline rounded-button items-center py-12 px-12 flex justify-center gap-24 min-w-200"
                                onClick={() => handleRemove(recipient)}
                                key={recipient}
                              >
                                <div className="text-dark-secondary lining-nums proportional-nums text-base font-normal">
                                  {formatSwedishNumberDisplay(recipient)}
                                </div>
                                <Icon className="flex justify-center items-center gap-4" icon={<Trash />} size={20} />
                              </button>
                            ))}
                          </div>
                        ) : (
                          <div className="text-dark-secondary lining-nums proportional-nums text-label-medium font-normal">
                            Du har inte lagt till några mottagare än
                          </div>
                        )}
                        {errors?.recipientList && (
                          <FormErrorMessage key={`recipientList-errors`}>
                            {errors.recipientList?.message}
                          </FormErrorMessage>
                        )}
                      </div>
                    </div>

                    <FormControl
                      invalid={!!errors?.message}
                      id="message"
                      className="flex flex-col items-start gap-8 self-stretch w-full"
                      size="md"
                    >
                      <div className="flex flex-row items-center gap-56 self-stretch justify-between">
                        <FormLabel className="text-label-medium text-dark-primary lining-nums proportional-nums flex-1">
                          Meddelande
                        </FormLabel>
                        <div className="text-dark-secondary lining-nums proportional-nums text-small font-normal">
                          {messageText?.length} / 459 tecken
                        </div>
                      </div>
                      <Textarea
                        className="flex min-h-182 flex-col items-start gap-8 self-stretch w-full text-dark-placeholder"
                        maxLength={459}
                        {...register('message')}
                      />
                    </FormControl>

                    {errors.message && (
                      <FormErrorMessage key={`message-errors`}>{errors.message?.message}</FormErrorMessage>
                    )}
                  </div>
                </div>
                <div className="flex justify-end items-start gap-80 self-stretch">
                  <Button
                    type="submit"
                    color="vattjom"
                    className="flex py-8 pr-16 pl-18 justify-center items-center gap-8"
                    rightIcon={<Icon icon={<SendHorizontal />} />}
                    loading={isSending}
                  >
                    Skicka sms
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
