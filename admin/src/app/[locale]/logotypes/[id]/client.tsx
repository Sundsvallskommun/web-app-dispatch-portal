'use client';

import { EditLogotype } from '@components/edit-logotype/edit-logotype.component';
import { EditorToolbar } from '@components/editor-toolbar/editor-toolbar';
import LoaderFullScreen from '@components/loader/loader-fullscreen';
import { defaultInformationFields } from '@config/defaults';
import resources from '@config/resources';
import { CreateLogotypeDto, Logotype, UpdateLogotypeDto } from '@data-contracts/backend/data-contracts';
import { Resource, ResourceResponse } from '@interfaces/resource';
import { ResourceName } from '@interfaces/resource-name';
import EditLayout from '@layouts/edit-layout/edit-layout.component';
import { getFormattedFields } from '@utils/formatted-field';
import { useRouteGuard } from '@utils/routeguard.hook';
import { useCrudHelper } from '@utils/use-crud-helpers';
import { useResource } from '@utils/use-resource';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FieldValues, FormProvider, useForm } from 'react-hook-form';
import { capitalize } from 'underscore.string';

interface EditViewProps {
  id: string;
}

export const EditView: React.FC<EditViewProps> = ({ id: _id }) => {
  const { t } = useTranslation();
  const router = useRouter();

  const resource: ResourceName = 'logotypes';

  const { create, update, getOne } = resources[resource];
  const { refresh } = useResource(resource);

  const { handleGetOne, handleCreate, handleUpdate } = useCrudHelper(resource);

  type DataType = CreateLogotypeDto | UpdateLogotypeDto;

  const form = useForm<DataType>();
  const {
    handleSubmit,
    reset,
    watch,
    setError,
    trigger,
    formState: { isDirty, errors },
  } = form;

  const id = _id === 'new' ? undefined : parseInt(_id as string, 10);

  const [loaded, setLoaded] = useState<boolean>(false);
  const [isNew, setIsNew] = useState<boolean>(!id);
  const [navigate, setNavigate] = useState<boolean>(false);

  const formdata = getFormattedFields(watch());

  useRouteGuard(isDirty);

  useEffect(() => {
    setNavigate(false);
    if (id) {
      setIsNew(false);
    }
  }, [id]);

  useEffect(() => {
    if (id) {
      handleGetOne(() => (getOne as NonNullable<Resource<FieldValues>['getOne']>)(id)).then((res) => {
        reset(res);
        setIsNew(false);
        setLoaded(true);
      });
    } else {
      reset({});
      setIsNew(true);
      setLoaded(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  useEffect(() => {
    if (navigate) {
      router.push(`/${resource}/${formdata?.id}`);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate]);

  useEffect(() => {
    if (formdata.id && isNew && !isDirty) {
      setNavigate(true);
    }
  }, [formdata?.id, isNew, isDirty]);

  const onSubmit = (data: DataType) => {
    const { logotypeLightMode, logotypeDarkMode } = data;
    if (!(data as Logotype).urlLightMode) {
      setError('logotypeLightMode', { message: t('logotypes:errors.logotypeLightMode.missing') });
    } else {
      switch (isNew) {
        case true:
          if (logotypeLightMode) {
            const createFunc: (data: CreateLogotypeDto) => ReturnType<NonNullable<Resource<FieldValues>['create']>> =
              create as NonNullable<Resource<FieldValues>['create']>;

            handleCreate(() => createFunc({ logotypeLightMode, logotypeDarkMode })).then((res) => {
              if (res) {
                reset(res);
                refresh();
              }
            });
          }

          break;
        case false:
          if (id) {
            const { name, removeDarkMode } = data as UpdateLogotypeDto;
            const updateFunc: (
              id: number,
              data: UpdateLogotypeDto
            ) => ReturnType<NonNullable<Resource<FieldValues>['update']>> = update as NonNullable<
              Resource<FieldValues>['update']
            >;

            handleUpdate(() => updateFunc(id, { name, removeDarkMode, logotypeLightMode, logotypeDarkMode })).then(
              (res) => {
                reset(res);
                refresh();
              }
            );
          }
          break;
      }
    }
  };

  return !loaded ?
      <LoaderFullScreen />
    : <EditLayout
        headerInfo={
          !isNew ?
            <ul className="text-small flex gap-16">
              {defaultInformationFields.map((field, index) => (
                <li key={index + field}>
                  <strong>{capitalize(t(`common:properties.${field}`))}: </strong>
                  {formdata?.[field]}
                </li>
              ))}
            </ul>
          : undefined
        }
        title={
          isNew ?
            capitalize(t('common:create_new', { resource: t(`${resource}:name`, { count: 1 }) }))
          : capitalize(t('common:edit', { resource: t(`${resource}:name_one`) }))
        }
        backLink={`/${resource}`}
      >
        <FormProvider {...form}>
          <form className="flex flex-row gap-32 justify-between grow flex-wrap" onSubmit={handleSubmit(onSubmit)}>
            <EditorToolbar resource={resource} isDirty={isDirty} id={id} />
            <EditLogotype isNew={isNew} />
          </form>
        </FormProvider>
      </EditLayout>;
};
