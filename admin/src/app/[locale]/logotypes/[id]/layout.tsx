import initLocalization, { namespaces } from '@app/i18n';
import { capitalize } from 'underscore.string';
import { LogotypeLayoutParams } from '../layout';
import { LocalizationLayoutProps } from '@app/[locale]/layout';

export interface EditLogotypeLayoutParams extends LogotypeLayoutParams {
  id: string;
}
export interface EditLogotypeLayoutProps {
  children: React.ReactNode;
  params: Promise<EditLogotypeLayoutParams>;
}

export const generateMetadata = async ({ params }: Readonly<EditLogotypeLayoutProps>) => {
  const { id, locale } = await params;
  const { t } = await initLocalization(locale ?? 'sv', namespaces);
  const resource = t('logotypes:name', { count: 1 });
  const isNew = !id || id === 'new';

  let title = isNew ? capitalize(t('common:create_new', { resource })) : capitalize(t('common:edit', { resource }));

  return {
    title,
  };
};
export default function EditLogotypeLayout({ children }: Readonly<EditLogotypeLayoutProps>) {
  return children;
}
