import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { useUserStore } from '@services/user-service/user-service';
import { useAppContext } from '@contexts/app.context';

export default function Logout() {
  const router = useRouter();
  const { reset: resetUser } = useUserStore();
  const { setDefaults } = useAppContext();
  useEffect(() => {
    const logout = () => {
      setDefaults();
      resetUser();
      localStorage.clear();
    };
    logout();
    router.push('/login?loggedout=true');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return <></>;
}
