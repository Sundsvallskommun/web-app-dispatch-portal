import { useEffect, useRef, useState } from 'react';
import EmptyLayout from '../layouts/empty-layout/empty-layout.component';
import { useRouter } from 'next/router';
import { Button, FormErrorMessage } from '@sk-web-gui/react';
import { redirect, useSearchParams } from 'next/navigation';
import { appURL } from '@utils/app-url';
import { apiURL } from '@utils/api-url';

// Turn on/off automatic login
const autoLogin = false;

export default function Start() {
  const router = useRouter();
  const [message, setMessage] = useState<string>();
  const searchParams = useSearchParams();
  const params = new URLSearchParams(globalThis.location.search);
  const isLoggedOut = params.get('loggedout') === '';
  const failMessage = params.get('failMessage');
  const initalFocus = useRef<HTMLButtonElement>(null);
  const setInitalFocus = () => {
    setTimeout(() => {
      initalFocus.current && initalFocus.current.focus();
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
    } else if (failMessage === 'SAML_MISSING_GROUP') {
      setMessage('Användaren saknar rätt grupper');
    } else if (failMessage === 'SAML_MISSING_ATTRIBUTES') {
      setMessage('Användaren saknar attribut');
    } else if (failMessage === 'Missing profile attributes') {
      setMessage('Användaren saknar rätt attribut');
    } else if (failMessage === 'Not Authorized' && autoLogin) {
      onLogin();
    }
  }, [router]);

  return (
    <>
      <EmptyLayout title={`Postportalen - Logga In`}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="max-w-5xl w-full flex flex-col bg-background-content p-20 shadow-lg text-left">
            <div className="text-center">
              <h3 className="mb-20">
                Logga in till <br aria-hidden />
                Postportalen
              </h3>
              {message && (
                <FormErrorMessage>
                  <p className="mb-20">Det gick inte att logga in. {message}</p>
                </FormErrorMessage>
              )}
            </div>

            <Button variant="primary" color="vattjom" onClick={() => onLogin()} ref={initalFocus} data-cy="loginButton">
              Logga in
            </Button>
          </div>
        </div>
      </EmptyLayout>
    </>
  );
}
