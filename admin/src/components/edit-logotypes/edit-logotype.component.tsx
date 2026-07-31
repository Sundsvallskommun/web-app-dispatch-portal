import { Resource } from '@interfaces/resource';
import Image from 'next/image';
import { FieldValues, useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { EditResourceInput } from '../edit-resource/edit-resource-input.component';
import React, { useEffect, useMemo } from 'react';

interface EditLogotypesProps {
  isNew?: boolean;
  property: string;
}

export const EditLogotype: React.FC<EditLogotypesProps> = ({ property }) => {
  const { t } = useTranslation();

  type CreateType = Parameters<NonNullable<Resource<FieldValues>['create']>>[0];
  type UpdateType = Parameters<NonNullable<Resource<FieldValues>['update']>>[1];
  type DataType = CreateType | UpdateType;

  const { watch } = useFormContext<DataType>();
  const logotype = watch(property);

  const localUrl = useMemo(() => (logotype instanceof File ? URL.createObjectURL(logotype) : ''), [logotype]);

  useEffect(() => {
    if (!localUrl) return;
    return () => URL.revokeObjectURL(localUrl);
  }, [localUrl]);

  const fallbackSrc = typeof logotype === 'string' ? logotype : '';
  const previewSrc = logotype instanceof File ? localUrl : fallbackSrc;

  return (
    <div className="flex flex-col gap-32 grow mb-32 max-w-[60rem] mt-32">
      <EditResourceInput property={property} required label={t(`logotypes:properties.${property}`)} />

      {previewSrc && (
        <>
          <h3>{t('images:preview')}</h3>
          <Image src={previewSrc} width="200" height="200" alt="" />
        </>
      )}
    </div>
  );
};
