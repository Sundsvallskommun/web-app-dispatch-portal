import { ColorSchemeMode, Divider, useGui } from '@sk-web-gui/react';
import React from 'react';
import { useLogotypeStore } from '@services/logotypes-service';
import { useTranslation } from 'react-i18next';
import NextLink from 'next/link';

export const Logotype: React.FC = () => {
  const logotype = useLogotypeStore((state) => state.logotype);
  const { t } = useTranslation();

  const { colorScheme, preferredColorScheme } = useGui();

  const mode: string = colorScheme === ColorSchemeMode.System ? preferredColorScheme : colorScheme;
  const logo =
    (mode === 'dark' ? logotype.logotype_darkmode : logotype.logotype_lightmode) ||
    logotype.logotype_lightmode ||
    logotype.logotype_darkmode;

  return (
    <NextLink href="/" className="flex justify-center items-center gap-8">
      {logo ? (
        <>
          <img
            src={logo}
            alt={t('common:logotype.alt', { display_name: logotype.display_name })}
            className="h-[50px] w-auto max-h-[50px]"
          />
          <Divider className="sk-logo-divider border-1 m-1" orientation="vertical" />
        </>
      ) : null}
      <div className="flex flex-col hover:underline">
        <span className="sk-logo-title text-dark-primary">{t('common:appTitle')}</span>
        <span className="sk-logo-subtitle">{logotype.display_name}</span>
      </div>
    </NextLink>
  );
};
