'use client';

import { useUserStore } from '@services/user-service/user-service';
import { apiURL } from '@utils/api-url';
import { appURL } from '@utils/app-url';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useShallow } from 'zustand/react/shallow';

export default function Logout() {
  const router = useRouter();

  const resetUser = useUserStore(useShallow((s) => s.reset));

  useEffect(() => {
    resetUser();
    localStorage.clear();
    const url = new URL(apiURL('/saml/logout'));
    url.searchParams.append('successRedirect', `${appURL()}/login?loggedout`);

    router.push(url.toString());

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <></>;
}
