import initLocalization, { namespaces } from '@app/i18n';
import DefaultLayout from '@layouts/default-layout/default-layout.component';
import { capitalize } from 'underscore.string';
import { ResourceLayoutProps } from '../[resource]/layout';

export const LogotypesLayout: React.FC<ResourceLayoutProps> = ({ children }) => {
  return <DefaultLayout>{children}</DefaultLayout>;
};

export const generateMetadata = async ({ params }: ResourceLayoutProps) => {
  const { resource: _resource, locale } = await params;

  const { t } = await initLocalization(locale ?? 'sv', namespaces);

  return {
    title: {
      default: capitalize(t(`logotypes:name_many`)),
      template: `%s - ${capitalize(t(`logotypes:name_many`))}`,
    },
  };
};

export default LogotypesLayout;
