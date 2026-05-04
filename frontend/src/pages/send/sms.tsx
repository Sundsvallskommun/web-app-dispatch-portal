import FormStepperHeader from '@components/form-stepper/form-stepper-header.component';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Button,
  cx,
  FormControl,
  FormLabel,
  Icon,
  Input,
  RadioButton,
  Textarea,
  useConfirm,
  useSnackbar,
} from '@sk-web-gui/react';
import { BadgeCheck, SendHorizontal, Smartphone } from 'lucide-react';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import NextLink from 'next/link';
import React, { useEffect, useState } from 'react';
import * as yup from 'yup';
import { FormProvider, useForm } from 'react-hook-form';
import CustomChip from '@components/custom-chip/custom-chip.component';
import { MobileNumberError, formatMobileNumberDisplay, tryNormalizeMobileNumber } from '@utils/phone-number.helpers';
import DefaultLayout from '@layouts/default-layout/default-layout.component';
import { Trans, useTranslation } from 'react-i18next';
import { TFunction } from 'i18next';
import { EnumQATags } from 'src/types';
import { sendSms, sendCsvSms } from '@services/message-service';
import { SMSRequest } from '@interfaces/sms';
import CustomFormErrorMessage from '@components/custom-form-error-message/custom-form-error-message.component';
import { useUserStore } from '@services/user-service/user-service';
import { useRouter } from 'next/router';
import { CsvSmsRecipients } from '@components/recipient-handler/components/csv-file-sms.component';
import { FileListItemComponent } from '@components/file-list-item/file-list-item.component';
import { Attachment } from '@components/attachment-handler/attachment-handler';
import { Csv } from 'src/data-contracts/backend/data-contracts';

const createFormSchema = (t: TFunction) => {
  const formSchema = yup
    .object({
      message: yup.string().min(3, t('send-sms:errors.messageEmpty')),
    })
    .required();

  return formSchema;
};

const initialValues = {
  country: '0',
  message: '',
  singleRecipient: '',
  singleRecipientList: [] as string[],
  recipientList: [] as Array<Csv & Attachment>,
};

export interface FormModel {
  country: string;
  message: string;
  singleRecipient: string;
  singleRecipientList: string[];
  recipientList: Array<Csv & Attachment>;
}

export default function SendEmailPage() {
  const [success, setSuccess] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [current, setCurrent] = React.useState<number>(0);
  const { t } = useTranslation(['common', 'send-sms']);
  const router = useRouter();
  const { user } = useUserStore();
  const confirm = useConfirm();
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

  const singleRecipientList = watch('singleRecipientList');
  const recipientList = watch('recipientList');
  const messageText = watch('message');
  const singleRecipient = watch('singleRecipient');

  const handleRemove = (recipient: string) => {
    const recipients = getValues('singleRecipientList');
    setValue(
      'singleRecipientList',
      recipients?.filter((item) => item !== recipient)
    );
  };

  const handleRemoveFile = () => {
    setValue('recipientList', []);
  };

  useEffect(() => {
    clearErrors(['recipientList', 'singleRecipient']);
  }, [singleRecipient, clearErrors]);
  useEffect(() => {
    clearErrors('message');
  }, [messageText, clearErrors]);

  const addRecipient = () => {
    clearErrors(['singleRecipient', 'singleRecipientList', 'recipientList']);

    const recipients = getValues('singleRecipientList') ?? [];
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
    setValue('singleRecipientList', [...recipients, recipient]);
  };

  const resetAll = () => {
    clearErrors('singleRecipientList');
    clearErrors('recipientList');
    setValue('singleRecipientList', []);
    setValue('recipientList', []);
  };

  const onSubmit = async (formData: Partial<FormModel>) => {
    if (!formData.message) return;

    if (current === 0) {
      if (!formData.singleRecipientList?.length) {
        setFormError('singleRecipientList', { message: t('send-sms:errors.minOneRecipient') });
        return;
      }
    } else if (!formData.recipientList?.length) {
      setFormError('recipientList', { message: t('send-sms:errors.missingCsv') });
      return;
    }

    setIsSending(true);

    try {
      if (current === 0) {
        const data: SMSRequest = {
          message: formData.message,
          recipients: formData.singleRecipientList!,
        };
        await sendSms(data);
      } else {
        await sendCsvSms(formData.message, formData.recipientList![0].id);
      }

      setSuccess(true);
      message({ message: t('send-sms:messages.smsSent'), status: 'success' });
      reset(initialValues);
      clearErrors();
    } catch (e) {
      setSuccess(false);
      message({ message: t('send-sms:messages.somethingWrong'), status: 'error' });
      console.error(t('send-sms:errors.somethingWrongWhenSendSms'), e);
    }

    setIsSending(false);
  };

  const handleSwitchCurrent = (navigateTo: number) => {
    if ((recipientList?.length ?? 0) > 0 || (singleRecipientList?.length ?? 0) > 0) {
      confirm
        .showConfirmation(
          t(`send-sms:changeTo.${navigateTo === 0 ? 'person' : 'list'}.label`),
          t(`send-sms:changeTo.${navigateTo === 0 ? 'person' : 'list'}.text`),
          t('common:yesContinue'),
          t('common:cancel')
        )
        .then((isConfirmed) => {
          if (isConfirmed) {
            resetAll();
            setCurrent(navigateTo);
          }
        });
    } else {
      resetAll();
      setCurrent(navigateTo);
    }
  };

  useEffect(() => {
    if (!user.permissions.canSendSMS) router.replace('/');
  }, [user.permissions.canSendSMS, router]);

  if (!user.permissions.canSendSMS) return null;

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
      <div>
        {success ? (
          <div className="text-center pt-64">
            <Icon size="5.6rem" color="gronsta" icon={<BadgeCheck />} />
            <h1 className="text-h4-sm md:text-h4-md xl:text-h4-lg mt-24">{t('send-sms:yourMessageSent')}</h1>
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
              <NextLink href="/" className="sk-btn sk-btn-md sk-btn-primary mt-lg" data-color="vattjom">
                {t('send-sms:toStartPage')}
              </NextLink>
            </div>
          </div>
        ) : (
          <div className="flex flex-col w-full max-w-[82rem] mx-auto mt-64">
            <FormProvider {...controls}>
              <form className="flex flex-col" onSubmit={handleSubmit(onSubmit)}>
                <div className="flex flex-col w-full justify-center gap-24">
                  <div className="flex flex-col items-start w-full shadow-50 p-32 rounded-14 gap-40 bg-background-content">
                    <div className="w-full flex flex-col gap-8">
                      <h2 className="text-h4-md m-0">{t('send-sms:title')}</h2>
                      <p className="text-dark-secondary">{t('send-sms:description')}</p>
                    </div>
                    <div className="flex flex-col gap-64 self-stretch">
                      <div className="flex flex-col w-full">
                        <h3 className="text-label-medium">{t('send-sms:howAddRecipient')}</h3>
                        <div className="flex flex-col md:flex-row gap-24 mt-12">
                          <div
                            className={cx(
                              'flex-1 border rounded-groups p-16',
                              current === 0 ? 'border-dark-primary' : 'border-divider'
                            )}
                          >
                            <RadioButton value="0" onChange={() => handleSwitchCurrent(0)} checked={current === 0}>
                              {t('send-sms:optionPersonalNumberOrAddress')}
                            </RadioButton>
                          </div>
                          <div
                            className={cx(
                              'flex-1 border rounded-groups p-16',
                              current === 1 ? 'border-dark-primary' : 'border-divider'
                            )}
                          >
                            <RadioButton value="1" onChange={() => handleSwitchCurrent(1)} checked={current === 1}>
                              {t('send-sms:optionRecipientList')}
                            </RadioButton>
                          </div>
                        </div>
                      </div>

                      {current === 0 ? (
                        <>
                          <FormControl
                            invalid={!!errors.singleRecipient?.message || !!errors.singleRecipientList}
                            id="recipient"
                            size="md"
                          >
                            <FormLabel className="text-label-medium text-dark-primary lining-nums proportional-nums w-full">
                              {t('send-sms:addMobileNumber')}
                            </FormLabel>
                            <div
                              data-cy="mobile-number-input"
                              className="flex justify-end items-end gap-16 self-stretch flex-wrap w-full"
                            >
                              <Input
                                className="flex items-center gap-8 flex-1 w-full min-w-[25rem]"
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
                            {errors?.singleRecipientList && (
                              <CustomFormErrorMessage message={errors.singleRecipientList.message} />
                            )}
                            {errors?.singleRecipient && (
                              <CustomFormErrorMessage message={errors.singleRecipient.message} />
                            )}
                          </FormControl>
                          <div className="flex flex-col items-start gap-12 self-stretch">
                            <div className="flex flex-col items-start gap-12 self-stretch">
                              <div className="text-label-medium text-dark-primary lining-nums proportional-nums">
                                {t('send-sms:addedRecipients')}
                              </div>
                              {singleRecipientList && singleRecipientList.length > 0 ? (
                                <div data-cy="phone-numbers" className="flex flex-col justify-center items-start gap-8">
                                  {singleRecipientList?.map((recipient) => (
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
                        </>
                      ) : (
                        <>
                          <div className="flex flex-col gap-8">
                            <p className="text-label-medium">{t('send-sms:fileUploadLabel')}</p>
                            <CsvSmsRecipients />
                          </div>
                          <div className="flex flex-col w-full">
                            <h3 className="text-label-medium font-sans">{t('send-sms:addedFileTitle')}</h3>
                            {(recipientList?.length ?? 0) < 1 ? (
                              <p className="text-base">{`${t('send-sms:noFileAdded')}`}</p>
                            ) : (
                              <FileListItemComponent
                                data-cy="recipientlist"
                                noBorder
                                data={recipientList![0]}
                                handleRemove={handleRemoveFile}
                              />
                            )}
                          </div>
                        </>
                      )}

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
                          data-cy="sms-message-input"
                          className="flex min-h-[18.2rem] flex-col items-start gap-8 self-stretch w-full"
                          maxLength={459}
                          {...register('message')}
                        />
                        {errors.message && <CustomFormErrorMessage message={errors.message?.message} />}
                      </FormControl>
                    </div>
                  </div>
                  <div className="flex justify-end items-start gap-80 self-stretch">
                    <Button
                      data-cy="send-sms-button"
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
            </FormProvider>
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
