'use client';

import { EditResource } from '@components/edit-resource/edit-resource.component';
import { EditorToolbar } from '@components/editor-toolbar/editor-toolbar';
import LoaderFullScreen from '@components/loader/loader-fullscreen';
import resources from '@config/resources';
import { Resource } from '@interfaces/resource';
import { ResourceName } from '@interfaces/resource-name';
import EditLayout from '@layouts/edit-layout/edit-layout.component';
import { getFormattedFields } from '@utils/formatted-field';
import { useRouteGuard } from '@utils/routeguard.hook';
import { stringToResourceName } from '@utils/stringToResourceName';
import { useCrudHelper } from '@utils/use-crud-helpers';
import { useResource } from '@utils/use-resource';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FieldValues, FormProvider, useForm } from 'react-hook-form';

interface EditResourceViewProps {
  resource: string;
  id: string;
}

export const EditResourceView: React.FC<EditResourceViewProps> = ({ resource: _resource, id: _id }) => {
  const router = useRouter();

  const resource = stringToResourceName(typeof _resource === 'object' ? _resource[0] : _resource) as ResourceName;

  const { create, update, getOne, defaultValues } = resources[resource];
  const { refresh } = useResource(resource);

  const { handleGetOne, handleCreate, handleUpdate } = useCrudHelper(resource);

  type CreateType = Parameters<NonNullable<Resource<FieldValues>['create']>>[0];
  type UpdateType = Parameters<NonNullable<Resource<FieldValues>['update']>>[1];
  type DataType = CreateType | UpdateType;

  const form = useForm<DataType>({
    defaultValues: defaultValues,
  });
  const {
    handleSubmit,
    reset,
    watch,
    formState: { isDirty },
  } = form;

  const id = _id === 'new' ? undefined : Number.parseInt(_id as string, 10);

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
        const mappedRes = Object.keys(res).reduce((data, key) => {
          return { ...data, [key]: res?.[key] ?? (defaultValues as any)?.[key] };
        }, {});
        reset(mappedRes);
        setIsNew(false);
        setLoaded(true);
      });
    } else {
      reset(defaultValues);
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
    const createFunc: (data: DataType) => ReturnType<NonNullable<Resource<FieldValues>['create']>> =
      create as NonNullable<Resource<FieldValues>['create']>;
    const updateFunc: (id: number, data: DataType) => ReturnType<NonNullable<Resource<FieldValues>['update']>> =
      update as NonNullable<Resource<FieldValues>['update']>;
    const newData = Object.keys(data)?.reduce((_data, key) => {
      if (data[key] === 'undefined' || data[key] === '' || data[key] === 'null') return { ..._data };
      if (new RegExp(/^\d+$/).test(data[key]) && key.toLowerCase().includes('id'))
        return { ..._data, [key]: Number.parseInt(data[key]) };
      return { ..._data, [key]: data[key] };
    }, {});
    switch (isNew) {
      case true:
        handleCreate(() => createFunc(newData as CreateType)).then((res) => {
          if (res) {
            reset(res);
            refresh();
          }
        });

        break;
      case false:
        if (id) {
          handleUpdate(() => updateFunc?.(id, newData)).then((res) => {
            reset(res);
            refresh();
          });
        }
        break;
    }
  };

  return !loaded ?
      <LoaderFullScreen />
    : <FormProvider {...form}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <EditLayout resource={resource}>
            <div className="flex flex-row gap-32 justify-between grow flex-wrap">
              <EditorToolbar resource={resource} id={id} />
              <EditResource resource={resource} />
            </div>
          </EditLayout>
        </form>
      </FormProvider>;
};
