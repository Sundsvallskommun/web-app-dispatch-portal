import initLocalization, { namespaces } from '@app/i18n';
import LocalizationProvider from '@components/localization-provider/localization-provider';
import { appName } from '@utils/app-name';
import { ReactNode } from 'react';

export interface LocalizationLayoutParams {
  locale: string;
}
export interface LocalizationLayoutProps {
  children: ReactNode;
  params: Promise<LocalizationLayoutParams>;
}

const LocalizationLayout = async (props: LocalizationLayoutProps) => {
  const { params, children } = props;
  const { locale } = await params;
  const { resources } = await initLocalization(locale, namespaces);

  return <LocalizationProvider {...{ locale, resources, namespaces }}>{children}</LocalizationProvider>;
};

export const generateMetadata = async ({ params }: LocalizationLayoutProps) => {
  const { locale } = await params;
  const { t } = await initLocalization(locale ?? 'sv', namespaces);

  return {
    title: {
      template: `%s - ${appName()}`,
      deafult: appName(),
    },
    description: t('common:app_description'),
  };
};

export default LocalizationLayout;
