'use client';

import { EditorToolbar } from '@components/editor-toolbar/editor-toolbar';
import { EditLogotype } from '@components/edit-logotypes/edit-logotype.component';
import LoaderFullScreen from '@components/loader/loader-fullscreen';
import resources from '@config/resources';
import EditLayout from '@layouts/edit-layout/edit-layout.component';
import { useRouteGuard } from '@utils/routeguard.hook';
import { useCrudHelper } from '@utils/use-crud-helpers';
import { useResource } from '@utils/use-resource';
import { useTranslation } from 'next-i18next';
import { useParams } from 'next/navigation';
import React, { useEffect, useMemo, useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { MessagingSettingsDto } from '@interfaces/messaging-settings';
import { FormErrorMessage, FormLabel, Input } from '@sk-web-gui/react';
import { createLogotypeRequestDto, createLogotypeSchema } from '@services/logotype-service';
import { yupResolver } from '@hookform/resolvers/yup';
import { HostSelect } from '@components/host-select/host-select.component';

const defaultValues = {
  id: '',
  display_name: '',
  host: '',
  logotype_lightmode: undefined,
  logotype_darkmode: undefined,
};

export default function LogotypePage() {
  const RESOURCE = 'logotypes' as const;
  const { t } = useTranslation();
  const schema = useMemo(() => createLogotypeSchema(t), [t]);
  const params = useParams<{ id: string }>();

  const { create, update, getOne } = resources[RESOURCE];
  const { refresh } = useResource(RESOURCE);
  const { handleGetOne, handleCreate, handleUpdate } = useCrudHelper(RESOURCE);

  const id = params?.id === 'new' ? undefined : params?.id;
  const isNew = id === undefined;

  const form = useForm<MessagingSettingsDto>({
    defaultValues,
    resolver: yupResolver(schema),
    mode: 'onSubmit',
    reValidateMode: 'onSubmit',
  });

  const {
    register,
    handleSubmit,
    reset,
    getValues,
    formState: { isDirty, errors },
  } = form;

  const [loaded, setLoaded] = useState(false);

  useRouteGuard(isDirty);

  useEffect(() => {
    setLoaded(false);

    if (id !== undefined && !Number.isNaN(id)) {
      handleGetOne(() => getOne(id)).then((res) => {
        reset(res);
        setLoaded(true);
      });
    } else {
      reset(defaultValues);
      setLoaded(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const onSubmit = async (data: MessagingSettingsDto) => {
    if (isNew && create) {
      const requestData = await createLogotypeRequestDto(data);
      handleCreate(() => create(requestData)).then(() => {
        reset();
        refresh();
      });
    }

    if (id !== undefined && update) {
      const requestData = await createLogotypeRequestDto(data);
      handleUpdate(() => update(id, requestData)).then(() => {
        reset(getValues());
        refresh();
      });
    }
  };

  if (!loaded) {
    return <LoaderFullScreen />;
  }

  return (
    <FormProvider {...form}>
      <EditLayout resource={RESOURCE}>
        <form className="flex flex-col gap-16 w-1/2" onSubmit={handleSubmit(onSubmit)}>
          <EditorToolbar resource={RESOURCE} id={id} />
          <Input {...register('id')} hidden />
          <HostSelect field="host" currentHost={getValues('host')} />
          <FormLabel>{t('logotypes:properties.display_name')}</FormLabel>
          <Input data-cy={`edit-logotype-display_name`} {...register('display_name')} />
          {errors.display_name && <FormErrorMessage>{errors.display_name?.message}</FormErrorMessage>}
          <EditLogotype isNew={isNew} property="logotype_lightmode" />
          <EditLogotype isNew={isNew} property="logotype_darkmode" />
        </form>
      </EditLayout>
    </FormProvider>
  );
}
