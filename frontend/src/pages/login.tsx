import { useEffect, useRef, useState } from 'react';
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
  const [message, setMessage] = useState<string>();
  const [mounting, setMounting] = useState<boolean>(true);
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const initalFocus = useRef<HTMLButtonElement>(null);
  const setInitalFocus = () => {
    setTimeout(() => {
      initalFocus.current && initalFocus.current.focus();
    });
  };

  const onLogin = () => {
    // NOTE: send user to login with SSO
    const path = searchParams?.get('path') || '';

    const url = new URL(apiURL('/saml/login'));
    const queries = new URLSearchParams({
      successRedirect: `${appURL(path as string)}`,
      failureRedirect: `${appURL()}/login`,
    });
    url.search = queries.toString();
    // NOTE: send user to login with SSO
    globalThis.location.href = url.toString();
  };

  useEffect(() => {
    setInitalFocus();
    if (router.query?.failMessage) {
      setMessage(t(`login:errors.${router.query.failMessage}`));
    }
  }, [router]);

  useEffect(() => {
    if (router.query?.failMessage && router.query.failMessage !== 'NOT_AUTHORIZED') {
      setMounting(false);
      return;
    }
    onLogin();
  }, []);

  return mounting ? (
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
