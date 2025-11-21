import { MyAppLayout } from '@layouts/app/app-layout.component';
import 'dayjs/locale/se';
import '../styles/tailwind.scss';
import i18nConfig from './i18nConfig';

interface LayoutProps {
  children?: React.ReactNode;
  params: Promise<{ locale?: string }>;
}

export const generateStaticParams = () => {
  return i18nConfig.locales.map((locale) => ({ locale }));
};

export default async function Layout({ children, params }: Readonly<LayoutProps>) {
  const { locale } = await params;
  return <MyAppLayout locale={locale ?? 'sv'}>{children}</MyAppLayout>;
}
