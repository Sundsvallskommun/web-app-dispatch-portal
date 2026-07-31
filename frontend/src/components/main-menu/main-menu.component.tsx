import { NavigationBar } from '@sk-web-gui/react';
import NextLink from 'next/link';
import React from 'react';
import { mainMenuItems } from './main-menu-items';
import { usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';

const getActiveItem = (pathname: string) => {
  if (pathname.startsWith('/my-statistics')) return 1;
  if (pathname === '/statistics') return 2;
  return 0;
};

export const MainMenu: React.FC = () => {
  const pathname = usePathname();
  const { t } = useTranslation(['common']);

  const active = getActiveItem(pathname);

  return (
    <div className="w-full shrink flex justify-end">
      <NavigationBar current={active} data-cy="mainmenu">
        {mainMenuItems.map((item, index) => (
          <NavigationBar.Item key={`mainmenu-${index}`} wrapper={<NextLink href={item.href} legacyBehavior passHref />}>
            <a>{t(`common:mainMenu.${item.label}`)}</a>
          </NavigationBar.Item>
        ))}
      </NavigationBar>
    </div>
  );
};
