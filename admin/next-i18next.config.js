/** @type {import('next-i18next').UserConfig} */
module.exports = {
  i18n: {
    defaultLocale: 'sv',
    locales: ['sv'],
    basePath: process.env.NEXT_PUBLIC_BASE_PATH,
  },
  defaultNS: 'common',
  fallbackLng: {
    default: ['sv'],
  },
  debug: process.env.NODE_ENV !== 'production',
  react: { useSuspense: false },
};
