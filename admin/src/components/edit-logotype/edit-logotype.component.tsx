import resources from '@config/resources';
import { FieldValues, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { capitalize } from 'underscore.string';

import { Resource } from '@interfaces/resource';
import { EditResourceInput } from '@components/edit-resource/edit-resource-input.component';
import {
  Button,
  CustomOnChangeEventUploadFile,
  FileUpload,
  FormControl,
  FormErrorMessage,
  FormLabel,
} from '@sk-web-gui/react';
import { LogoPreview } from '@components/logo-preview/logo-preview.component';
import { Logotype } from '@data-contracts/backend/data-contracts';

interface EditLogotypeProps {
  isNew: boolean;
}

export const EditLogotype: React.FC<EditLogotypeProps> = ({ isNew }) => {
  const { t } = useTranslation();
  const resource = 'logotypes';

  type CreateType = Parameters<NonNullable<Resource<FieldValues>['create']>>[0];
  type UpdateType = Parameters<NonNullable<Resource<FieldValues>['update']>>[1];
  type DataType = CreateType | UpdateType;

  const {
    watch,
    setValue,
    register,
    formState: { errors },
  } = useFormContext<DataType>();
  const formdata = watch() as DataType;

  const resetLogo = (mode: 'LightMode' | 'DarkMode') => {
    setValue(`url${mode}`, '', { shouldDirty: true });
    setValue(`filename${mode}`, '', { shouldDirty: true });
    setValue(`logotype${mode}`, '', { shouldDirty: true });
    if (mode === 'DarkMode') {
      setValue(`removeDarkMode`, true, { shouldDirty: true });
    }
  };

  const handleFileUpload = (event: CustomOnChangeEventUploadFile) => {
    const mode = event.target.name.replace('logotype', '');
    if (event.target.value[0].file) {
      const url = URL.createObjectURL(event.target.value[0].file);
      setValue(event.target.name, event.target.value[0].file, { shouldDirty: true });
      setValue(`filename${mode}`, event.target.value[0].file.name);
      setValue(`url${mode}`, url);
      setValue(`url${mode}`, url);
    }
  };

  const imageMimeTypes = ['image/jpeg', 'image/gif', 'image/png', 'image/svg+xml'];

  return (
    <>
      <div className="flex flex-col gap-32 grow mb-32">
        {!isNew && (
          <EditResourceInput
            property={'name'}
            index={0}
            required={!isNew}
            label={capitalize(t(`${resource}:properties.name`))}
          />
        )}
        <FormControl>
          <FormLabel>{t('logotypes:properties:filenameLightMode')}</FormLabel>
          {formdata.filenameLightMode ?
            <>
              <div className="p-24 bg-white">
                <LogoPreview
                  logotype={formdata as Logotype}
                  mode="light"
                  name={t('logotypes:properties:filenameLightMode')}
                />
              </div>
              <Button variant="secondary" onClick={() => resetLogo('LightMode')}>
                {t('logotypes:remove_image')}
              </Button>
            </>
          : <>
              <FileUpload {...register('logotypeLightMode')} onChange={handleFileUpload} accept={imageMimeTypes} />
              {errors?.logotypeLightMode?.message && (
                <FormErrorMessage>{errors.logotypeLightMode.message as string}</FormErrorMessage>
              )}
            </>
          }
        </FormControl>
        <FormControl>
          <FormLabel>{t('logotypes:properties:filenameDarkMode')}</FormLabel>
          {formdata.filenameDarkMode ?
            <>
              <div className="p-24 bg-black">
                <LogoPreview
                  logotype={formdata as Logotype}
                  mode="dark"
                  name={t('logotypes:properties:filenameDarkMode')}
                />
              </div>
              <Button variant="secondary" onClick={() => resetLogo('DarkMode')}>
                {t('logotypes:remove_image')}
              </Button>
            </>
          : <>
              <FileUpload {...register('logotypeDarkMode')} onChange={handleFileUpload} accept={imageMimeTypes} />
              {errors?.logotypeDarkMode?.message && (
                <FormErrorMessage>{errors.logotypeDarkMode.message as string}</FormErrorMessage>
              )}
            </>
          }
        </FormControl>
      </div>
      <div className="flex flex-col gap-32 grow mb-32"></div>
    </>
  );
};
