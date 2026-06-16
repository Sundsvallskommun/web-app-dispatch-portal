/* eslint-disable @typescript-eslint/no-require-imports */
const envalid = require('envalid');
const { i18n } = require('./next-i18next.config');

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const authDependent = envalid.makeValidator((x) => {
  const authEnabled = process.env.HEALTH_AUTH === 'true';

  if (authEnabled && !x.length) {
    throw new Error(`Can't be empty if "HEALTH_AUTH" is true`);
  }

  return x;
});

envalid.cleanEnv(process.env, {
  NEXT_PUBLIC_API_URL: envalid.str(),
  HEALTH_AUTH: envalid.bool(),
  HEALTH_USERNAME: authDependent(),
  HEALTH_PASSWORD: authDependent(),
});

module.exports = withBundleAnalyzer({
  basePath: process.env.NEXT_PUBLIC_BASEPATH ?? process.env.NEXT_PUBLIC_BASE_PATH ?? process.env.BASE_PATH ?? '',
  experimental: {},
  output: 'standalone',
  i18n,
  async rewrites() {
    return [{ source: '/napi/:path*', destination: '/api/:path*' }];
  },
  async redirects() {
    const adminUrl = process.env.ADMIN_URL;
    if (!adminUrl || !adminUrl.startsWith('http')) {
      return [];
    }

    return [
      { source: '/admin', destination: adminUrl, permanent: false, basePath: false },
      { source: '/admin/:path*', destination: `${adminUrl}/:path*`, permanent: false, basePath: false },
    ];
  },
});
