import { Resource } from '@interfaces/resource';
import Image from 'next/image';
import { FieldValues, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { EditResourceInput } from '../edit-resource/edit-resource-input.component';
import React, { useEffect, useState } from 'react';

interface EditLogotypesProps {
  isNew?: boolean;
  property: string;
}

export const EditLogotype: React.FC<EditLogotypesProps> = ({ property }) => {
  const { t } = useTranslation();
  const [localUrl, setLocalUrl] = useState<string>('');

  type CreateType = Parameters<NonNullable<Resource<FieldValues>['create']>>[0];
  type UpdateType = Parameters<NonNullable<Resource<FieldValues>['update']>>[1];
  type DataType = CreateType | UpdateType;

  const { watch } = useFormContext<DataType>();
  const logotype = watch(property);

  useEffect(() => {
    if (logotype instanceof File) {
      const url = URL.createObjectURL(logotype);
      setLocalUrl(url);
      return () => URL.revokeObjectURL(url);
    }
    setLocalUrl('');
  }, [logotype]);

  const previewSrc =
    logotype instanceof File ? localUrl
    : typeof logotype === 'string' ? logotype
    : '';

  return (
    <div className="flex flex-col gap-32 grow mb-32 max-w-[60rem] mt-32">
      <EditResourceInput
        data-cy="edit-images-name"
        property={property}
        required
        label={t(`logotypes:properties.${property}`)}
      />

      {previewSrc && (
        <>
          <h3>{t('images:preview')}</h3>
          <Image src={previewSrc} width="200" height="200" alt="" />
        </>
      )}
    </div>
  );
};
