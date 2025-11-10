import React from 'react';
import { useDepartments } from '@services/departments-service';
import { FormControl, FormLabel, Input, Spinner, Select, Divider } from '@sk-web-gui/react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import CustomFormErrorMessage from '@components/custom-form-error-message/custom-form-error-message.component';
import HandlerWrapper from '@components/handler-wrapper/handler-wrapper.component';

export interface SenderFormModel {
  department: string;
  subject: string;
}

export const SenderHandler: React.FC = () => {
  const { departments, loaded } = useDepartments();
  const {
    register,
    formState: { errors },
  } = useFormContext<SenderFormModel>();
  const { t } = useTranslation(['common', 'send-mail']);

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
        <Input invalid={!!errors?.subject} className="max-w-[467px]" {...register('subject')} />
        {errors?.subject && <CustomFormErrorMessage message={errors.subject.message?.toString()} padded={false} />}
      </FormControl>
      <Divider className="w-full my-22" />
      <FormControl className="w-full">
        <h4 className="text-h4-md">{t('send-mail:senderHandler.headerManagement')}</h4>
        <p className="text-secondary">{t('send-mail:senderHandler.managementDescription')}</p>
        <FormLabel className="text-label-medium mt-24">{t('send-mail:senderHandler.managementLabel')}</FormLabel>
        <Select
          invalid={!!errors?.department}
          className="w-full max-w-[467px]"
          {...register('department')}
          defaultValue={''}
        >
          <Select.Option value="" disabled>
            {t('send-mail:senderHandler.selectManagementText')}
          </Select.Option>
          {departments?.map((dep, index) => (
            <Select.Option key={`${index}-${dep.orgName}`} value={dep.orgName}>
              {dep.orgName}
            </Select.Option>
          ))}
        </Select>
        {errors?.department && (
          <CustomFormErrorMessage message={errors.department.message?.toString()} padded={false} />
        )}
      </FormControl>
    </HandlerWrapper>
  );
};
