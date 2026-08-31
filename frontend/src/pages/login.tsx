import { useEffect, useRef } from 'react';
import EmptyLayout from '../layouts/empty-layout/empty-layout.component';
import { useRouter } from 'next/router';
import { Button, FormErrorMessage } from '@sk-web-gui/react';
import { useTranslation } from 'react-i18next';
import { useSearchParams } from 'next/navigation';
import { apiURL } from '@utils/api-url';
import { appURL } from '@utils/app-url';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import LoaderFullScreen from '@components/loader/loader-fullscreen';

export function Start() {
  const router = useRouter();
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const initalFocus = useRef<HTMLButtonElement>(null);
  const setInitalFocus = () => {
    setTimeout(() => {
      initalFocus.current?.focus();
    });
  };

  const failMessage = router.query?.failMessage;
  const message = failMessage ? t(`login:errors.${failMessage}`) : undefined;
  // Any failure other than NOT_AUTHORIZED means the form is shown instead of
  // bouncing the user straight back to SSO.
  const showLogin = !!failMessage && failMessage !== 'NOT_AUTHORIZED';

  const onLogin = () => {
    // NOTE: send user to login with SSO
    const path = searchParams?.get('path') || '';
    const host = globalThis.location.host;

    const url = new URL(apiURL('/saml/login'));
    const queries = new URLSearchParams({
      successRedirect: appURL(path as string),
      failureRedirect: appURL('/login'),
      host,
    });
    url.search = queries.toString();
    // NOTE: send user to login with SSO
    globalThis.location.href = url.toString();
  };

  useEffect(() => {
    setInitalFocus();
  }, [router]);

  useEffect(() => {
    if (showLogin) {
      return;
    }
    onLogin();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return !showLogin ? (
    <LoaderFullScreen />
  ) : (
    <>
      <EmptyLayout title={`Postportalen - Logga In`}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="max-w-5xl w-full flex flex-col bg-background-content p-20 shadow-lg text-left">
            <div className="text-center">
              <h3 className="mb-20">
                {t('login:page.title')}
                <br aria-hidden />
                {t('common:appTitle')}
              </h3>
              {message && (
                <FormErrorMessage>
                  <p className="mb-20">
                    {t('login:loginFailure')} {message}
                  </p>
                </FormErrorMessage>
              )}
            </div>

            <Button variant="primary" color="vattjom" onClick={() => onLogin()} ref={initalFocus} data-cy="loginButton">
              {t('login:login')}
            </Button>
          </div>
        </div>
      </EmptyLayout>
    </>
  );
}

export const getServerSideProps: GetServerSideProps<object> = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'sv', ['common', 'login'])),
  },
});

export default Start;
