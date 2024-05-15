import { mainMenuItems } from '@components/main-menu/main-menu-items';
import { MainMenu } from '@components/main-menu/main-menu.component';
import { useMediaQuery } from '@mui/material';
import { useUserStore } from '@services/user-service/user-service';
import { Header, Icon, PopupMenu, UserMenu, useGui } from '@sk-web-gui/react';
import { apiURL } from '@utils/api-url';
import Head from 'next/head';
import NextLink from 'next/link';
import { ReactNode, useRef } from 'react';
import { shallow } from 'zustand/shallow';
import { userMenuGroups } from './userMenuGroups';

interface DefaultLayoutProps {
  title: string;
  pageheader?: JSX.Element;
  children: ReactNode;
}

export default function DefaultLayout({ title, pageheader, children }: DefaultLayoutProps) {
  const initialFocus = useRef<HTMLElement>(null);
  const gui = useGui();
  const isMedium = useMediaQuery(`screen and (min-width:${gui.theme?.screens?.md})`);
  const user = useUserStore((s) => s.user, shallow);

  const setInitialFocus = () => {
    setTimeout(() => {
      initialFocus.current && initialFocus.current.focus();
    });
  };

  return (
    <div className="DefaultLayout full-page-layout">
      <Head>
        <title>{title}</title>
        <meta name="description" content="Postportalen" />
      </Head>

      <NextLink legacyBehavior={true} href="#content" passHref>
        <a onClick={setInitialFocus} accessKey="s" className="next-link-a">
          Hoppa till innehåll
        </a>
      </NextLink>
      <div className="z-10">
        <Header
          title={`Postportalen`}
          LogoLinkWrapperComponent={<NextLink legacyBehavior={true} href={'/'} passHref />}
          userMenu={
            <span data-cy="usermenu">
              <UserMenu
                initials={`${user.givenName.charAt(0)}${user.surname.charAt(0)}`}
                menuTitle={`${user.name} (${user.username})`}
                menuGroups={userMenuGroups}
                image={`${apiURL(`/user/avatar?width=${44}`)}`}
              />
            </span>
          }
          mobileMenu={
            <PopupMenu align="end">
              <PopupMenu.Button data-cy="mobilemenu" iconButton color="primary" variant="primary">
                <Icon name="menu" />
              </PopupMenu.Button>
              <PopupMenu.Panel>
                <PopupMenu.Items>
                  <PopupMenu.Group>
                    {mainMenuItems.map((item, index) => (
                      <PopupMenu.Item key={`mainmenu-${index}`}>
                        <NextLink href={item.href} legacyBehavior passHref>
                          <a href={item.href}>{item.label}</a>
                        </NextLink>
                      </PopupMenu.Item>
                    ))}
                  </PopupMenu.Group>
                  {userMenuGroups.map((menuGroup, groupIndex) => (
                    <PopupMenu.Group key={`userGroup-${groupIndex}`} aria-label={menuGroup.label}>
                      {menuGroup.elements.map((menuItem, itemIndex) => (
                        <PopupMenu.Item key={`userGroup-${groupIndex}-${itemIndex}`}>
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

      <main className="main-wrapper" ref={initialFocus}>
        {pageheader && pageheader}
        <div className="main-container flex-grow">
          <div className="container">{children}</div>
        </div>
      </main>
    </div>
  );
}
