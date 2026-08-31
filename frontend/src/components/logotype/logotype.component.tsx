import { ColorSchemeMode, Logo, useGui } from '@sk-web-gui/react';
import { useLogotypeStore } from '@services/logotypes-service';
import { useTranslation } from 'react-i18next';
import NextLink from 'next/link';
import React from 'react';

export const Logotype: React.FC = () => {
  const logotype = useLogotypeStore((state) => state.logotype);
  const { t } = useTranslation();
  const { colorScheme, preferredColorScheme } = useGui();

  const mode = colorScheme === ColorSchemeMode.System ? preferredColorScheme : colorScheme;
  const src =
    (mode === 'dark' ? logotype?.logotype_darkmode : logotype?.logotype_lightmode) ||
    logotype?.logotype_lightmode ||
    logotype?.logotype_darkmode;

  const displayName = logotype?.display_name || t('common:appSubTitle');

  return (
    <NextLink data-cy="logotype-component" href="/">
      <Logo
        variant="service"
        title={t('common:appTitle')}
        subtitle={displayName}
        symbol={
          src ? (
            <img
              className="w-full h-full py-4 object-contain"
              src={src}
              alt={t('common:logotype.alt', { display_name: displayName })}
            />
          ) : null
        }
      />
    </NextLink>
  );
};
