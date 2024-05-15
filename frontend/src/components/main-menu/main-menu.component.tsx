import { MenuBar } from '@sk-web-gui/react';
import NextLink from 'next/link';
import { useEffect, useState } from 'react';
import { mainMenuItems } from './main-menu-items';

export const MainMenu: React.FC = () => {
  const [active, setActive] = useState<number>(0);

  useEffect(() => {
    if(window.location.pathname === '/statistics') {
      setActive(1);
    } else if(window.location.pathname === '/help') {
      setActive(2);
    } else {
      setActive(0);
    }
  }, []);

  return (
    <div className="w-full shrink flex justify-end">
      <MenuBar current={active} data-cy="mainmenu">
        {mainMenuItems.map((item, index) => (
          <MenuBar.Item key={`mainmenu-${index}`} wrapper={<NextLink href={item.href} legacyBehavior passHref />}>
            <a>{item.label}</a>
          </MenuBar.Item>
        ))}
      </MenuBar>
    </div>
  );
};
