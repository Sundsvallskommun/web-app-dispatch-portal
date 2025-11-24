import LoaderFullScreen from '@components/loader/loader-fullscreen';
import { useUserStore } from '@services/user-service/user-service';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

export const LoginGuard: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const { user, getMe } = useUserStore();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    getMe().finally(() => {
      setMounted(true);
    });

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (mounted && !user.name && !router.pathname.startsWith('/login')) {
    const path = globalThis.location.pathname.startsWith('/logout') ? '/' : globalThis.location.pathname;
    router.push(`/login?path=${path}`);
  }

  if (!mounted || (!user.name && router.pathname !== '/login')) {
    return <LoaderFullScreen />;
  }

  return <>{children}</>;
};

export default LoginGuard;
