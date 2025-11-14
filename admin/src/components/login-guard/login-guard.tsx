'use client';
import LoaderFullScreen from '@components/loader/loader-fullscreen';
import { useUserStore } from '@services/user-service/user-service';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useShallow } from 'zustand/react/shallow';

export const LoginGuard: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  const user = useUserStore(useShallow((state) => state.user));
  const getMe = useUserStore(useShallow((state) => state.getMe));

  const router = useRouter();
  const pathname = usePathname();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getMe().finally(() => {
      setIsLoading(false);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!isLoading && !user.name && !pathname.startsWith('/login')) {
    const path = !window.location.pathname.startsWith('/logout') ? window.location.pathname : '/';
    router.push(`/login?path=${path}`);
  }

  if (isLoading || (!user.name && !pathname.startsWith('/login'))) {
    return <LoaderFullScreen />;
  }
  return <>{children}</>;
};

export default LoginGuard;
