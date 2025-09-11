/** @type {import('next-i18next').UserConfig} */
module.exports = {
  i18n: {
    defaultLocale: 'sv',
    locales: ['sv'],
  },
  interpolation: {
    prefix: '{',
    suffix: '}',
  },
  localeStructure: '{lng}/{ns}',
  react: { useSuspense: false },
  reloadOnPrerender: process.env.NODE_ENV === 'development',
};
