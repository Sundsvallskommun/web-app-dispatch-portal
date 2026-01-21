import React, { useEffect } from 'react';
import { useMyDepartment } from '@services/departments-service';
import { FormControl, FormLabel, Input, Spinner, Divider } from '@sk-web-gui/react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import CustomFormErrorMessage from '@components/custom-form-error-message/custom-form-error-message.component';
import HandlerWrapper from '@components/handler-wrapper/handler-wrapper.component';

export interface SenderFormModel {
  department: string;
  subject: string;
}

export const SenderHandler: React.FC = () => {
  const { myDepartment, loaded } = useMyDepartment();
  const {
    register,
    setValue,
    formState: { errors },
  } = useFormContext<SenderFormModel>();
  const { t } = useTranslation(['common', 'send-mail']);

  useEffect(() => {
    if (myDepartment) {
      setValue('department', myDepartment, {
        shouldDirty: false,
        shouldValidate: false,
      });
    }
  }, [myDepartment, setValue]);

  return !loaded ? (
    <Spinner />
  ) : (
    <HandlerWrapper
      title={t('send-mail:senderHandler.headerLabel')}
      description={t('send-mail:senderHandler.headerDescription')}
      gap={18}
    >
      <FormControl className="w-full" size="md">
        <FormLabel className="text-label-medium">{t('send-mail:senderHandler.formLabelHeader')}</FormLabel>
        <Input
          invalid={!!errors?.subject}
          data-cy="sender-subject"
          className="max-w-[467px]"
          {...register('subject')}
        />
        {errors?.subject && <CustomFormErrorMessage message={errors.subject.message?.toString()} />}
      </FormControl>
      <Divider className="w-full my-22" />
      <FormControl className="w-full gap-24">
        <div className="flex flex-col gap-6">
          <h2 className="text-h4-sm">{t('send-mail:senderHandler.headerManagement')}</h2>
          <p className="text-secondary">{t('send-mail:senderHandler.managementDescription')}</p>
        </div>
        <div className="text-dark-primary font-bold">{myDepartment}</div>
      </FormControl>
    </HandlerWrapper>
  );
};
