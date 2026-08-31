import { ResourceResponse } from '@interfaces/resource';
import { useSnackbar } from '@sk-web-gui/react';
import { useTranslation } from 'react-i18next';
import { capitalize } from 'underscore.string';

export const useCrudHelper = (resource: string) => {
  const message = useSnackbar();
  const { t } = useTranslation();

  const handleGetOne = async <T>(getOne: () => ResourceResponse<T>): Promise<T | undefined> => {
    const name = t(`${resource}:name_one`);
    try {
      const result = await getOne();
      return result.data.data;
    } catch {
      message({ message: capitalize(t('crud:get_one.error', { resource: name })), status: 'error' });
    }
  };

  const handleGetMany = async <T>(getMany: () => ResourceResponse<T>): Promise<T | undefined> => {
    const name = t(`${resource}:name_many`);
    try {
      const result = await getMany();
      return result.data.data;
    } catch {
      message({ message: capitalize(t('crud:get_one.error', { resource: name })), status: 'error' });
    }
  };

  const handleCreate = async <T>(create: () => ResourceResponse<T>): Promise<T | undefined> => {
    const name = t(`${resource}:name_one`);
    try {
      const result = await create();
      if (result) {
        message({ message: capitalize(t('crud:create.success', { resource: name })), status: 'success' });
        return result.data.data;
      }
    } catch {
      message({ message: t('crud:create.error', { resource: name }), status: 'error' });
    }
  };

  const handleUpdate = async <T>(update: () => ResourceResponse<T>): Promise<T | undefined> => {
    const name = t(`${resource}:name_one`);
    try {
      const result = await update();
      if (result) {
        message({ message: capitalize(t('crud:update.success', { resource: name })), status: 'success' });
        return result.data.data;
      }
    } catch {
      message({ message: capitalize(t('crud:update.error', { resource: name })), status: 'error' });
    }
  };

  const handleRemove = async <T>(remove: () => ResourceResponse<T>): Promise<T | undefined> => {
    const name = t(`${resource}:name_one`);
    try {
      const result = await remove();
      if (result) {
        message({ message: capitalize(t('crud:remove.success', { resource: name })), status: 'success' });
        return result.data.data;
      }
    } catch {
      message({ message: capitalize(t('crud:remove.error', { resource: name })), status: 'error' });
    }
  };

  return { handleGetOne, handleGetMany, handleCreate, handleUpdate, handleRemove };
};
