import initLocalization, { namespaces } from '@app/i18n';
import DefaultLayout from '@layouts/default-layout/default-layout.component';
import { capitalize } from 'underscore.string';
import { LocalizationLayoutParams } from '../layout';
import React from 'react';

const RESOURCE = 'logotypes';

export interface LogotypesLayoutProps {
  children: React.ReactNode;
  params: Promise<LocalizationLayoutParams>;
}

export const generateMetadata = async ({ params }: LogotypesLayoutProps) => {
  const { locale } = await params;
  const { t } = await initLocalization(locale ?? 'sv', namespaces);

  const title = capitalize(t(`${RESOURCE}:name_many`));

  return {
    title: {
      default: title,
      template: `%s - ${title}`,
    },
  };
};

export default function LogotypesLayout({ children }: Readonly<LogotypesLayoutProps>) {
  return <DefaultLayout>{children}</DefaultLayout>;
}
