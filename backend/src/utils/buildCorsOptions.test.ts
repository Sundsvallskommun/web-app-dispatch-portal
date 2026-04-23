describe('buildCorsOptions', () => {
  afterEach(() => {
    jest.resetModules();
    jest.clearAllMocks();
  });

  const loadModule = (nodeEnv = 'production') => {
    const isAllowedOrigin = jest.fn();

    jest.doMock('@config', () => ({
      BASE_URL_PREFIX: '/api',
      CREDENTIALS: true,
      NODE_ENV: nodeEnv,
    }));

    jest.doMock('./isAllowedOrigin', () => ({
      isAllowedOrigin,
    }));

    const module = require('./buildCorsOptions') as typeof import('./buildCorsOptions');

    return { ...module, isAllowedOrigin };
  };

  it('bypasses the SAML login callback path', async () => {
    const { isCorsOriginAllowedForPath, isAllowedOrigin } = loadModule();

    await expect(isCorsOriginAllowedForPath('/api/saml/login/callback', 'https://blocked.example')).resolves.toBe(true);
    expect(isAllowedOrigin).not.toHaveBeenCalled();
  });

  it('bypasses the SAML logout callback path', async () => {
    const { isCorsOriginAllowedForPath, isAllowedOrigin } = loadModule();

    await expect(isCorsOriginAllowedForPath('/api/saml/logout/callback', 'https://blocked.example')).resolves.toBe(true);
    expect(isAllowedOrigin).not.toHaveBeenCalled();
  });

  it('keeps rejecting disallowed origins for non-callback paths', async () => {
    const { buildCorsOptions, isAllowedOrigin } = loadModule();
    isAllowedOrigin.mockResolvedValue(false);

    const originHandler = buildCorsOptions('/api/users').origin as (
      origin: string | undefined,
      callback: (err: Error | null, allow?: boolean) => void,
    ) => void;

    await new Promise<void>(resolve => {
      originHandler('https://blocked.example', (err, allow) => {
        expect(err).toEqual(new Error('Not allowed by CORS'));
        expect(allow).toBeUndefined();
        resolve();
      });
    });

    expect(isAllowedOrigin).toHaveBeenCalledWith('https://blocked.example');
  });

  it('keeps allowing origins in development mode', async () => {
    const { isCorsOriginAllowedForPath, isAllowedOrigin } = loadModule('development');
    isAllowedOrigin.mockResolvedValue(false);

    await expect(isCorsOriginAllowedForPath('/api/users', 'https://blocked.example')).resolves.toBe(true);
    expect(isAllowedOrigin).toHaveBeenCalledWith('https://blocked.example');
  });
});
