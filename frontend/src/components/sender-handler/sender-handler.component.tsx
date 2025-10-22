import React from 'react';
import { useDepartments } from '@services/departments-service';
import { FormControl, FormLabel, Input, Spinner, Select, Divider } from '@sk-web-gui/react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import CustomFormErrorMessage from '@components/custom-form-error-message/custom-form-error-message.component';

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
    <div className="w-full flex justify-center">
      <div className="flex flex-col items-start w-full border-1 border-divider rounded-cards p-32">
        <div className="w-full mb-24">
          <h4>{t('send-mail:senderHandler.headerLabel')}</h4>
          <p>{t('send-mail:senderHandler.headerDescription')}.</p>
        </div>
        <FormControl className="w-full mb-40" size="md">
          <FormLabel className="text-label-medium">{t('send-mail:senderHandler.formLabelHeader')}</FormLabel>
          <Input invalid={!!errors?.subject} className="max-w-[467px]" {...register('subject')} />
          {errors?.subject && <CustomFormErrorMessage message={errors.subject.message?.toString()} padded={false} />}
        </FormControl>
        <Divider className="w-full mb-40" />
        <FormControl className="w-full">
          <h4>{t('send-mail:senderHandler.headerManagement')}</h4>
          <p>{t('send-mail:senderHandler.managementDescription')}</p>
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
      </div>
    </div>
  );
};
