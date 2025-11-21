import initLocalization from '@app/i18n';
import EmptyLayout from '@layouts/empty-layout/empty-layout.component';
import { LocalizationLayoutProps } from '../layout';

export const generateMetadata = async ({ params }: LocalizationLayoutProps) => {
  const { locale } = await params;

  const { t } = await initLocalization(locale ?? 'sv', ['common', 'login']);

  return {
    title: `${t('login:page.title')}`,
    description: t('login:page.description'),
  };
};

export default function Layout({ children }: Readonly<LocalizationLayoutProps>) {
  return <EmptyLayout>{children}</EmptyLayout>;
}
