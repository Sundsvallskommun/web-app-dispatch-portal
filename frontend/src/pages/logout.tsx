import { apiURL } from '@utils/api-url';
import { appURL } from '@utils/app-url';
import { useEffect } from 'react';

export default function Logout() {
  useEffect(() => {
    const url = new URL(apiURL('/saml/logout'));
    const queries = new URLSearchParams({
      successRedirect: appURL('/login'),
      failureRedirect: appURL('/login'),
    });
    url.search = queries.toString();
    globalThis.location.href = url.toString();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <></>;
}
