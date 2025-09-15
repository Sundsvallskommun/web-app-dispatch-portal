import { MenuBar } from '@sk-web-gui/react';
import NextLink from 'next/link';
import React, { useEffect, useState } from 'react';
import { mainMenuItems } from './main-menu-items';
import { usePathname } from 'next/navigation';
import { useTranslation } from 'react-i18next';

export const MainMenu: React.FC = () => {
  const [active, setActive] = useState<number>(0);
  const pathname = usePathname();
  const { t } = useTranslation(['common']);

  useEffect(() => {
    if (pathname.startsWith('/send')) {
      setActive(0);
    } else if (pathname.startsWith('/my-statistics')) {
      setActive(1);
    } else if (pathname === '/statistics') {
      setActive(2);
    } else {
      setActive(0);
    }
  }, [pathname]);

  return (
    <div className="w-full shrink flex justify-end">
      <MenuBar current={active} data-cy="mainmenu">
        {mainMenuItems.map((item, index) => (
          <MenuBar.Item key={`mainmenu-${index}`} wrapper={<NextLink href={item.href} legacyBehavior passHref />}>
            <a>{t(`mainMenu.${item.label}`)}</a>
          </MenuBar.Item>
        ))}
      </MenuBar>
    </div>
  );
};
