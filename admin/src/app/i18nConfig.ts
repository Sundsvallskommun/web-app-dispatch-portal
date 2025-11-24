import { basePath } from 'next.config';

const i18nConfig = {
  locales: ['sv'],
  defaultLocale: 'sv',
  basePath: process.env.NEXT_PUBLIC_BASE_PATH,
};

export default i18nConfig;
