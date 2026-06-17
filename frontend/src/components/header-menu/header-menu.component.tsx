import React from 'react';
import { mainMenuItems } from '@components/main-menu/main-menu-items';
import { MainMenu } from '@components/main-menu/main-menu.component';
import { useUserStore } from '@services/user-service/user-service';
import { Header, Icon, PopupMenu, UserMenu, useThemeQueries } from '@sk-web-gui/react';
import { apiURL } from '@utils/api-url';
import NextLink from 'next/link';
import { useShallow } from 'zustand/shallow';
import { Menu } from 'lucide-react';
import { useTranslation } from 'next-i18next';
import { userMenuGroups } from '@layouts/default-layout/userMenuGroups';
import { Logotype } from '@components/logotype/logotype.component';

const HeaderMenu = () => {
  const { isMinMd } = useThemeQueries();
  const user = useUserStore(useShallow((state) => state.user));
  const { t } = useTranslation(['common']);

  const setFocusToMain = () => {
    const contentElement = document.getElementById('content');
    contentElement?.focus();
  };

  return (
    <React.Fragment>
      <NextLink
        onClick={setFocusToMain}
        className="sr-only focus:not-sr-only bg-primary-light border-2 border-black p-4 text-black inline-block focus:absolute focus:top-0 focus:left-0 focus:right-0 focus:m-auto focus:w-80 text-center"
        href="#content"
      >
        {t('common:goToContent')}
      </NextLink>
      <div className="z-10 header-container">
        <Header
          data-cy="header"
          title={t('common:appTitle')}
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
          logo={<Logotype />}
        >
          {isMinMd && <MainMenu />}
        </Header>
      </div>
    </React.Fragment>
  );
};

export default HeaderMenu;
