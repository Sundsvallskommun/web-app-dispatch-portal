import initLocalization, { namespaces } from '@app/i18n';
import DefaultLayout from '@layouts/default-layout/default-layout.component';
import { capitalize } from 'underscore.string';
import { LocalizationLayoutParams } from '../layout';

export interface LogotypeLayoutParams extends LocalizationLayoutParams {
  resource: string;
  id?: string;
}
export interface LogotypeLayoutProps {
  children: React.ReactNode;
  params: Promise<LogotypeLayoutParams>;
}

export const generateMetadata = async ({ params }: LogotypeLayoutProps) => {
  const { resource: _resource, locale } = await params;

  const { t } = await initLocalization(locale ?? 'sv', namespaces);
  const title = capitalize(t(`logotypes:name_many`));
  return {
    title: {
      default: title,
      template: `%s - ${title}`,
    },
  };
};

export default function LogotypesLayout({ children }: Readonly<LogotypeLayoutProps>) {
  return <DefaultLayout>{children}</DefaultLayout>;
}
