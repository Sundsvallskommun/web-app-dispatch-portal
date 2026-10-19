const i18n = {
  defaultLocale: 'sv',
  locales: ['sv', 'en'],
};

const LOCALES_DIR = './public/locales';

// Server only. next-i18next needs the namespace list when localePath is a function, so derive it from the
// files in public/locales/<defaultLocale> instead of maintaining it by hand.
const namespacesFromDisk = () => {
  if (typeof window !== 'undefined') return undefined;
  const fs = require('node:fs');
  return fs
    .readdirSync(`${LOCALES_DIR}/${i18n.defaultLocale}`)
    .filter((file) => file.endsWith('.json') && !file.endsWith('.missing.json'))
    .map((file) => file.replace(/\.json$/, ''));
};

const ns = namespacesFromDisk();

/** @type {import('next-i18next').UserConfig} */
module.exports = {
  i18n,
  interpolation: {
    prefix: '{',
    suffix: '}',
  },
  // i18next-fs-backend >= 2.6.3 interpolates loadPath itself and only understands {{lng}}/{{ns}},
  // while next-i18next derives the path check from the single-brace prefix/suffix above. A function
  // localePath sidesteps both, so the locale files resolve regardless of the interpolation delimiters.
  localePath: (locale, namespace, missing) => `${LOCALES_DIR}/${locale}/${namespace}${missing ? '.missing' : ''}.json`,
  // A function cannot be serialised to the client, so the config is passed to appWithTranslation in _app.tsx instead.
  serializeConfig: false,
  ...(ns ? { ns } : {}),
  react: { useSuspense: false },
  reloadOnPrerender: process.env.NODE_ENV === 'development',
};
