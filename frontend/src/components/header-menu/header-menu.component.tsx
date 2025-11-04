import React, { useRef } from 'react';
import { mainMenuItems } from '@components/main-menu/main-menu-items';
import { MainMenu } from '@components/main-menu/main-menu.component';
import { useMediaQuery } from '@mui/material';
import { useUserStore } from '@services/user-service/user-service';
import { Button, Header, Icon, PopupMenu, UserMenu, useGui } from '@sk-web-gui/react';
import { apiURL } from '@utils/api-url';
import NextLink from 'next/link';
import { shallow } from 'zustand/shallow';
import { Menu } from 'lucide-react';
import { useTranslation } from 'next-i18next';
import { userMenuGroups } from '@layouts/default-layout/userMenuGroups';
import { useRouter } from 'next/router';

const HeaderMenu = () => {
  const initialFocus = useRef<HTMLElement>(null);
  const gui = useGui();
  const isMedium = useMediaQuery(`screen and (min-width:${gui.theme?.screens?.md})`);
  const user = useUserStore((s) => s.user, shallow);
  const { t } = useTranslation(['common']);
  const router = useRouter();

  const setInitialFocus = () => {
    setTimeout(() => {
      initialFocus.current?.focus();
    });
  };

  return (
    <React.Fragment>
      <NextLink legacyBehavior={true} href="#content" passHref>
        <Button tabIndex={0} onClick={setInitialFocus} onKeyDown={setInitialFocus} className="next-link-a">
          {t('common:goToContent')}
        </Button>
      </NextLink>
      <div className="z-10 header-container">
        <Header
          data-cy="header"
          title={t('common:appTitle')}
          subtitle={t('common:appSubTitle')}
          logoLinkOnClick={() => router.push('/')}
          userMenu={
            <span data-cy="usermenu">
              <UserMenu
                initials={`${user.givenName.charAt(0)}${user.surname.charAt(0)}`}
                menuTitle={`${user.name} (${user.username})`}
                menuGroups={userMenuGroups}
                image={apiURL(`/user/avatar?width=44`)}
              />
            </span>
          }
          mobileMenu={
            <PopupMenu align="end">
              <PopupMenu.Button data-cy="mobilemenu" iconButton color="primary" variant="primary">
                <Icon icon={<Menu />} />
              </PopupMenu.Button>
              <PopupMenu.Panel>
                <PopupMenu.Items>
                  <PopupMenu.Group>
                    {mainMenuItems.map((item) => (
                      <PopupMenu.Item key={`mainmenu-${item.label}`}>
                        <NextLink href={item.href}>{t(`common:mainMenu.${item.label}`)}</NextLink>
                      </PopupMenu.Item>
                    ))}
                  </PopupMenu.Group>
                  {userMenuGroups.map((menuGroup) => (
                    <PopupMenu.Group key={`userGroup-${menuGroup.label}`} aria-label={menuGroup.label}>
                      {menuGroup.elements.map((menuItem, itemIndex) => (
                        <PopupMenu.Item key={`userGroup-${menuGroup.label}-${itemIndex}`}>
                          {menuItem.element()}
                        </PopupMenu.Item>
                      ))}
                    </PopupMenu.Group>
                  ))}
                </PopupMenu.Items>
              </PopupMenu.Panel>
            </PopupMenu>
          }
        >
          {isMedium && <MainMenu />}
        </Header>
      </div>
    </React.Fragment>
  );
};

export default HeaderMenu;
