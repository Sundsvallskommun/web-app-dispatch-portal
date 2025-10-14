import FormStepperHeader from '@components/form-stepper/form-stepper-header.component';
import { yupResolver } from '@hookform/resolvers/yup';
import { useMediaQuery } from '@mui/material';
import {
  Button,
  Divider,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Icon,
  Input,
  Textarea,
  useGui,
  useSnackbar,
} from '@sk-web-gui/react';
import { BadgeCheck, Info, SendHorizontal, Smartphone } from 'lucide-react';
import { TFunction, Trans, useTranslation } from 'next-i18next';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import NextLink from 'next/link';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import CustomChip from '@components/custom-chip/custom-chip.component';
import { SMSRequest, SMSStatus } from '@interfaces/sms';
import { ApiResponse, apiService } from '@services/api-service';
import { MobileNumberError, formatMobileNumberDisplay, tryNormalizeMobileNumber } from '@services/phone-number.service';
import DefaultLayout from '@layouts/default-layout/default-layout.component';

const createFormSchema = (t: TFunction) => {
  const formSchema = yup
    .object({
      message: yup.string().min(3, t('send-sms:errors.message-empty')),
      recipientList: yup.array().test('HAS_MIN_ONE', t('send-sms:errors:min-one-recipient'), (value) => {
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
  }, [singleRecipient]);
  useEffect(() => {
    clearErrors('message');
  }, [messageText]);

  const addRecipient = () => {
    clearErrors(['singleRecipient', 'recipientList']);

    const recipients = getValues('recipientList') ?? [];
    const recipientValue = getValues('singleRecipient');

    const normalizingResult = tryNormalizeMobileNumber(recipientValue);
    let message = '';
    if (!normalizingResult.ok || !normalizingResult.value) {
      if (normalizingResult.error === MobileNumberError.EMPTY_INPUT) {
        message = t('send-sms:errors.give-min-10-digits-mobile-number');
      } else {
        message = t('send-sms:errors.wrong-mobile-number-format');
      }

      setFormError('singleRecipient', { message });
      return;
    }

    let recipient = normalizingResult.value;

    if (recipients?.includes(recipient)) {
      setFormError('singleRecipient', { message: t('send-sms:errors.number-already-added') });
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
      message({ message: t('send-sms:messages.something-wrong'), status: 'error' });
      console.error(t('send-sms:errors.something-wrong-when-send-sms'), e);
      throw e;
    });

    if (res?.data?.data?.batchId) {
      setSuccess(true);
      message({ message: t('send-sms:messages.sms-sent'), status: 'success' });
      // NOTE: fix for textarea (message) to update
      setTimeout(() => {
        reset(initialValues);
      }, 1);
    }

    setIsSending(false);
  };

  return (
    <DefaultLayout title={`Postportalen`} headerMenu={<FormStepperHeader title="Skicka Sms" icon={<Smartphone />} />}>
      <div className="sms-main-container">
        <div className="sms-container">
          <h1 className="sr-only">{t('send-sms:sendSms')}</h1>
          <div className="text-lg flex flex-col justify-start items-center gap-56 self-stretch">
            {success ? (
              <div className="text-center flex flex-col items-start gap-59 self-stretch">
                <div className="flex flex-col items-center gap-24 self-stretch">
                  <Icon size="6.4rem" className="text-gronsta-surface-primary" icon={<BadgeCheck />} />
                  <div className="flex flex-col items-center gap-16">
                    <h2 className="text-dark-primary lining-nums proportional-nums text-h2-md">
                      {t('send-sms:your-message-sent')}
                    </h2>
                    <p className="text-dark-primary text-center lining-nums proportional-nums text-base font-normal">
                      <Trans
                        i18nKey={'send-sms:you-can-review-messages-in-sent-list'}
                        components={{ strong: <strong /> }}
                      ></Trans>
                      .
                    </p>
                  </div>
                </div>
                <div className="flex md-px-174 py-0 justify-center items-start gap-16 self-stretch flex-wrap">
                  <Button
                    color="primary"
                    variant="secondary"
                    onClick={() => {
                      resetAll();
                      setSuccess(false);
                    }}
                  >
                    {t('send-sms:send-new-sms')}
                  </Button>
                  <NextLink href="/" passHref legacyBehavior>
                    <Button color="vattjom">{t('send-sms:to-start-page')}</Button>
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
                      {t('send-sms:some-info')}
                    </div>
                    <Divider className="w-full" orientation="horizontal" strong={false} />
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
                              {t('send-sms:add-mobile-number')}
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
                          {t('send-sms:added-recipients')}
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
                            {t('send-sms:you-did-not-add-some-recipients')}
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
                    {t('send-sms:sendSms')}
                  </Button>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </DefaultLayout>
  );
}
export const getServerSideProps: GetServerSideProps<object> = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'sv', ['common', 'send-sms'])),
  },
});
