'use client';

import { EditLogotype } from '@components/edit-logotype/edit-logotype.component';
import { EditorToolbar } from '@components/editor-toolbar/editor-toolbar';
import LoaderFullScreen from '@components/loader/loader-fullscreen';
import resources, { LogotypeFiles } from '@config/resources';
import { Logotype, UpdateLogotypeDto } from '@data-contracts/backend/data-contracts';
import EditLayout from '@layouts/edit-layout/edit-layout.component';
import { getFormattedFields } from '@utils/formatted-field';
import { useRouteGuard } from '@utils/routeguard.hook';
import { useCrudHelper } from '@utils/use-crud-helpers';
import { useResource } from '@utils/use-resource';
import { useTranslation } from 'next-i18next';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';

interface EditLogotypeViewProps {
  id: string;
}

export const EditLogotypeView: React.FC<EditLogotypeViewProps> = ({ id: _id }) => {
  const id = _id === 'new' ? undefined : Number.parseInt(_id as string, 10);
  const [loaded, setLoaded] = useState<boolean>(false);
  const [isNew, setIsNew] = useState<boolean>(!id);
  const [navigate, setNavigate] = useState<boolean>(false);

  const { t } = useTranslation();
  const router = useRouter();

  const { create, update, getOne } = resources.logotypes;
  const { refresh } = useResource('logotypes');

  const { handleGetOne, handleCreate, handleUpdate } = useCrudHelper('logotypes');

  type UpdateType = UpdateLogotypeDto & LogotypeFiles;
  type DataType = LogotypeFiles | UpdateType;
  const form = useForm<DataType>();
  const {
    handleSubmit,
    reset,
    watch,
    setError,
    formState: { isDirty },
  } = form;

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
      handleGetOne(() => getOne(id)).then((res) => {
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
      router.push(`/logotypes/${formdata?.id}`);
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
    if (!(data as unknown as Logotype).urlLightMode) {
      setError('logotypeLightMode', { message: t('logotypes:errors.logotypeLightMode.missing') });
    } else {
      switch (isNew) {
        case true:
          if (logotypeLightMode && create) {
            handleCreate(() => create({ logotypeLightMode, logotypeDarkMode })).then((res) => {
              if (res) {
                reset(res);
                refresh();
              }
            });
          }

          break;
        case false:
          if (id && update) {
            const { name, removeDarkMode } = data as UpdateType;
            handleUpdate(() => update(id, { name, removeDarkMode, logotypeLightMode, logotypeDarkMode })).then(
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
    : <FormProvider {...form}>
        <form onSubmit={handleSubmit(onSubmit)}>
          <EditLayout resource="logotypes">
            <div className="flex flex-row gap-32 justify-between grow flex-wrap" onSubmit={handleSubmit(onSubmit)}>
              <EditorToolbar resource="logotypes" id={id} />
              <EditLogotype />
            </div>
          </EditLayout>
        </form>
      </FormProvider>;
};
