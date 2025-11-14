import DefaultLayout from '@layouts/default-layout/default-layout.component';
import { stringToResourceName } from '@utils/stringToResourceName';
import { capitalize } from 'underscore.string';
import { LocalizationLayoutParams, LocalizationLayoutProps } from '../layout';
import initLocalization, { namespaces } from '@app/i18n';
import { redirect } from 'next/navigation';

export interface ResourceLayoutParams extends LocalizationLayoutParams {
  resource: string;
}
export interface ResourceLayoutProps extends Omit<LocalizationLayoutProps, 'params'> {
  params: Promise<ResourceLayoutParams>;
}

export const ResourceLayout: React.FC<ResourceLayoutProps> = ({ children }) => {
  return <DefaultLayout>{children}</DefaultLayout>;
};

export const generateMetadata = async ({ params }: ResourceLayoutProps) => {
  const { resource: _resource, locale } = await params;

  const { t } = await initLocalization(locale ?? 'sv', namespaces);

  const resource = stringToResourceName(typeof _resource === 'object' ? _resource[0] : _resource);

  if (!resource) {
    redirect('/');
  }

  return {
    title: {
      default: capitalize(t(`${resource}:name_many`)),
      template: `%s - ${capitalize(t(`${resource}:name_many`))}`,
    },
  };
};

export default ResourceLayout;
