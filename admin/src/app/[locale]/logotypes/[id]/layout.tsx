import initLocalization, { namespaces } from '@app/i18n';
import { capitalize } from 'underscore.string';
import { LocalizationLayoutParams } from '../../layout';
import React from 'react';

const RESOURCE = 'logotypes';

export interface EditLogotypeLayoutParams extends LocalizationLayoutParams {
  id: string;
}

export interface EditLogotypeLayoutProps {
  children: React.ReactNode;
  params: Promise<EditLogotypeLayoutParams>;
}

export const generateMetadata = async ({ params }: Readonly<EditLogotypeLayoutProps>) => {
  const { id, locale } = await params;
  const { t } = await initLocalization(locale ?? 'sv', namespaces);

  const isNew = !id || id === 'new';
  const resourceName = t(`${RESOURCE}:name`);

  const title = capitalize(
    isNew ? t('common:create_new', { resource: resourceName }) : t('common:edit', { resource: resourceName })
  );

  return { title };
};

export default function EditLogotypeLayout({ children }: Readonly<EditLogotypeLayoutProps>) {
  return children;
}
