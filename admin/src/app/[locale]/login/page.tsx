'use client';

import LoaderFullScreen from '@components/loader/loader-fullscreen';
import Main from '@layouts/main/main.component';
import { Button, FormErrorMessage } from '@sk-web-gui/react';
import { apiURL } from '@utils/api-url';
import { appURL } from '@utils/app-url';
import { useTranslation } from 'next-i18next';
import { redirect, useSearchParams } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { capitalize } from 'underscore.string';

// Turn on/off automatic login
const autoLogin = true;

export default function Login() {
  const searchParams = useSearchParams();

  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const { t } = useTranslation(['common', 'login']);

  const params = new URLSearchParams(globalThis.location.search);
  const isLoggedOut = params.get('loggedout') === '';
  const failMessage = params.get('failMessage');

  const initalFocus = useRef<HTMLButtonElement>(null);
  const setInitalFocus = () => {
    setTimeout(() => {
      initalFocus?.current?.focus();
    });
  };

  const onLogin = () => {
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
    if (isLoggedOut) {
      redirect('/login');
    } else if (failMessage === 'NOT_AUTHORIZED' && autoLogin) {
      // autologin
      onLogin();
    } else if (failMessage) {
      setErrorMessage(t(`login:errors.${failMessage}`));
      setIsLoading(false);
    } else {
      setIsLoading(false);
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (isLoading) {
    // to not flash the login-screen on autologin
    return <LoaderFullScreen />;
  }

  return (
    <Main>
      <div className="flex items-center justify-center min-h-screen">
        <div className="max-w-5xl w-full flex flex-col text-light-primary bg-inverted-background-content p-20 shadow-lg text-left">
          <div className="mb-14 w-fit">
            <p className="my-0">{capitalize(t('common:admin_for'))}</p>
            <h1 className="mb-10 text-xl">{process.env.NEXT_PUBLIC_APP_NAME}</h1>
            <p className="my-0">{t('login:page.description')}</p>
          </div>

          <Button inverted onClick={() => onLogin()} ref={initalFocus} data-cy="loginButton">
            {capitalize(t('common:login'))}
          </Button>

          {errorMessage && <FormErrorMessage className="mt-lg">{errorMessage}</FormErrorMessage>}
        </div>
      </div>
    </Main>
  );
}
