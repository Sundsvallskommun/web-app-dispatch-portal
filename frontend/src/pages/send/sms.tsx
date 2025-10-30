import FormStepperHeader from '@components/form-stepper/form-stepper-header.component';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Icon,
  Input,
  Textarea,
  useSnackbar,
} from '@sk-web-gui/react';
import { BadgeCheck, Info, SendHorizontal, Smartphone } from 'lucide-react';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import NextLink from 'next/link';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import CustomChip from '@components/custom-chip/custom-chip.component';
import { SMSRequest, SMSStatus } from '@interfaces/sms';
import { ApiResponse, apiService } from '@services/api-service';
import { MobileNumberError, formatMobileNumberDisplay, tryNormalizeMobileNumber } from '@utils/phone-number.helpers';
import DefaultLayout from '@layouts/default-layout/default-layout.component';
import { Trans, useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';
import { EnumQATags } from 'src/types';

const createFormSchema = (t: TFunction) => {
  const formSchema = yup
    .object({
      message: yup.string().min(3, t('send-sms:errors.messageEmpty')),
      recipientList: yup.array().test('HAS_MIN_ONE', t('send-sms:errors:minOneRecipient'), (value) => {
        return value && value.length > 0;
      }),
    })
    .required();

  return formSchema;
};

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
  const [success, setSuccess] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const { t } = useTranslation(['common', 'send-sms']);

  const message = useSnackbar();

  const formSchema = createFormSchema(t);
  const controls = useForm<Partial<FormModel>>({
    resolver: yupResolver(formSchema),
    values: initialValues,
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
  });

  const {
    watch,
    handleSubmit,
    setValue,
    getValues,
    register,
    reset,
    formState: { errors },
    clearErrors,
    setError: setFormError,
  } = controls;

  const recipientList = watch('recipientList');
  const messageText = watch('message');
  const singleRecipient = watch('singleRecipient');
  const handleRemove = (recipient: string) => {
    const recipients = getValues('recipientList');
    setValue(
      'recipientList',
      recipients?.filter((item) => item !== recipient)
    );
  };

  useEffect(() => {
    clearErrors(['recipientList', 'singleRecipient']);
  }, [singleRecipient, clearErrors]);
  useEffect(() => {
    clearErrors('message');
  }, [messageText, clearErrors]);

  const addRecipient = () => {
    clearErrors(['singleRecipient', 'recipientList']);

    const recipients = getValues('recipientList') ?? [];
    const recipientValue = getValues('singleRecipient');

    const normalizingResult = tryNormalizeMobileNumber(recipientValue);
    let message = '';
    if (!normalizingResult.ok || !normalizingResult.value) {
      if (normalizingResult.error === MobileNumberError.EMPTY_INPUT) {
        message = t('send-sms:errors.giveMin10DigitsMobileNumber');
      } else {
        message = t('send-sms:errors.wrongMobileNumberFormat');
      }

      setFormError('singleRecipient', { message });
      return;
    }

    const recipient = normalizingResult.value;

    if (recipients?.includes(recipient)) {
      setFormError('singleRecipient', { message: t('send-sms:errors.numberAlreadyAdded') });
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
      message({ message: t('send-sms:messages.somethingWrong'), status: 'error' });
      console.error(t('send-sms:errors.somethingWrongWhenSendSms'), e);
      throw e;
    });

    if (res?.data?.data?.batchId) {
      setSuccess(true);
      message({ message: t('send-sms:messages.smsSent'), status: 'success' });
      // NOTE: fix for textarea (message) to update
      setTimeout(() => {
        reset(initialValues);
      }, 1);
    }

    setIsSending(false);
  };

  return (
    <DefaultLayout
      title={`Postportalen`}
      headerMenu={
        <FormStepperHeader
          title={t('send-sms:sendSms')}
          icon={<Smartphone />}
          isSuccess={success}
          helpType={EnumQATags.SMS}
        />
      }
    >
      <h1 className="sr-only">Skicka SMS</h1>
      <div className="text-lg mb-11 ">
        {success ? (
          <div className="text-center pt-64">
            <Icon size="5.6rem" color="gronsta" icon={<BadgeCheck />} />
            <h2 className="mt-24">{t('send-sms:yourMessageSent')}</h2>
            <p className="my-md text-base">
              <Trans i18nKey={'send-sms:youCanReviewUnderSentTab'} components={{ strong: <strong /> }} />
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
                {t('send-sms:sendNewSms')}
              </Button>
              <NextLink href="/" passHref legacyBehavior>
                <Button className="mt-lg" color="vattjom">
                  {t('send-sms:toStartPage')}
                </Button>
              </NextLink>
            </div>
          </div>
        ) : (
          <div className="flex flex-col w-full max-w-[82rem] mx-auto mt-64">
            <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
              <div className="flex flex-col w-full justify-center gap-24">
                <div className="flex flex-col items-start w-full shadow-50 p-32 rounded-14 gap-40">
                  <div className="w-full">
                    <FormControl size="md" className="flex-grow w-full" id="title">
                      <div className="text-h4-md">{t('send-sms:title')}</div>
                      <div className="font-normal text-dark-secondary text-label-medium">
                        {t('send-sms:discription')}
                      </div>
                    </FormControl>
                  </div>
                  <div className="flex flex-col gap-56 items-start self-stretch">
                    <div>
                      <div className="flex max-w-382 flex-col items-start gap-16">
                        <div className="flex flex-col items-start gap-8 self-stretch w-full">
                          <FormControl
                            invalid={!!errors.singleRecipient?.message}
                            id="recipient"
                            className="flex-grow w-full"
                            size="md"
                          >
                            <FormLabel className="text-label-medium text-dark-primary lining-nums proportional-nums w-full">
                              {t('send-sms:addMobileNumber')}
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
                                {t('send-sms:add')}
                              </Button>
                            </div>
                            {errors?.recipientList && (
                              <FormErrorMessage
                                className="text-error-text-primary flex items-center gap-8"
                                key={`recipientList-errors`}
                              >
                                <Icon size="1.6rem" icon={<Info />} color="error" className="self-start" />{' '}
                                {errors.recipientList.message}
                              </FormErrorMessage>
                            )}
                            {errors?.singleRecipient && (
                              <FormErrorMessage
                                className="text-error-text-primary flex items-center gap-8"
                                key={`singleRecipient-errors`}
                              >
                                <Icon size="1.6rem" icon={<Info />} color="error" className="self-start" />{' '}
                                {errors.singleRecipient.message}
                              </FormErrorMessage>
                            )}
                          </FormControl>
                        </div>
                      </div>
                    </div>
                    <div className="flex flex-col items-start gap-12 self-stretch">
                      <div className="flex flex-col items-start gap-12 self-stretch">
                        <div className="text-label-medium text-dark-primary lining-nums proportional-nums">
                          {t('send-sms:addedRecipients')}
                        </div>
                        {recipientList && recipientList.length > 0 ? (
                          <div className="flex flex-col justify-center items-start gap-8">
                            {recipientList?.map((recipient) => (
                              <CustomChip key={recipient} onRemove={() => handleRemove(recipient)}>
                                {formatMobileNumberDisplay(recipient)}
                              </CustomChip>
                            ))}
                          </div>
                        ) : (
                          <div className="text-dark-secondary lining-nums proportional-nums text-label-medium font-normal">
                            {t('send-sms:youDidNotAddSomeRecipients')}
                          </div>
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
                          {t('send-sms:message')}
                        </FormLabel>
                        <div className="text-dark-secondary lining-nums proportional-nums text-small font-normal">
                          {messageText?.length} / 459 {t('send-sms:characters')}
                        </div>
                      </div>
                      <Textarea
                        className="flex min-h-182 flex-col items-start gap-8 self-stretch w-full text-dark-placeholder"
                        maxLength={459}
                        {...register('message')}
                      />
                      {errors.message && (
                        <FormErrorMessage
                          className="text-error-text-primary flex items-center gap-8"
                          key={`message-errors`}
                        >
                          <Icon size="1.6rem" icon={<Info />} color="error" className="self-start" />{' '}
                          {errors.message?.message}
                        </FormErrorMessage>
                      )}
                    </FormControl>
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
                    {t('send-sms:send')}
                  </Button>
                </div>
              </div>
            </form>
          </div>
        )}
      </div>
    </DefaultLayout>
  );
}
export const getServerSideProps: GetServerSideProps<object> = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'sv', ['common', 'send-sms', 'help-menu'])),
  },
});
