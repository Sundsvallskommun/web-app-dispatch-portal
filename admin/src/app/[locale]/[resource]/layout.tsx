import initLocalization, { namespaces } from '@app/i18n';
import DefaultLayout from '@layouts/default-layout/default-layout.component';
import { stringToResourceName } from '@utils/stringToResourceName';
import { redirect } from 'next/navigation';
import { capitalize } from 'underscore.string';
import { LocalizationLayoutParams } from '../layout';

export interface ResourceLayoutParams extends LocalizationLayoutParams {
  resource: string;
  id?: string;
}
export interface ResourceLayoutProps {
  children: React.ReactNode;
  params: Promise<ResourceLayoutParams>;
}

export const generateMetadata = async ({ params }: ResourceLayoutProps) => {
  const { resource: _resource, locale } = await params;

  const { t } = await initLocalization(locale ?? 'sv', namespaces);

  const resource = stringToResourceName(typeof _resource === 'object' ? _resource[0] : _resource);

  if (!resource) {
    redirect('/');
  }
  const title = capitalize(t(`${resource}:name_many`));
  return {
    title: {
      default: title,
      template: `%s - ${title}`,
    },
  };
};
export default function ResourceLayout({ children }: Readonly<ResourceLayoutProps>) {
  return <DefaultLayout>{children}</DefaultLayout>;
}
