const envalid = require('envalid');

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
  turbopack: { root: __dirname },
  output: 'standalone',
  images: {
    // The only next/image usage is a fixed-size logotype preview for admin users, so optimisation adds nothing.
    // Disabling it turns off the /_next/image endpoint (sharp decoding of remote, user-uploaded images, SSRF surface).
    unoptimized: true,
  },
  basePath: process.env.NEXT_PUBLIC_BASE_PATH || '',
  transpilePackages: ['lucide-react'],
  experimental: {
    swcPlugins: process.env.TEST === 'true' ? [['swc-plugin-coverage-instrument', {}]] : [],
    optimizePackageImports: ['@sk-web-gui'],
  },
  async rewrites() {
    return [{ source: '/napi/:path*', destination: '/api/:path*' }];
  },
});
