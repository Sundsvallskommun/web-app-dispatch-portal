'use client';

import { Logotype } from '@data-contracts/backend/data-contracts';
import { Logo, useGui } from '@sk-web-gui/react';
import { apiURL } from '@utils/api-url';
import { appName } from '@utils/app-name';
import Image from 'next/image';
import { useTranslation } from 'react-i18next';
import { capitalize } from 'underscore.string';

interface LogoPreviewInterface {
  logotype: Logotype;
  name?: string;
  mode?: 'light' | 'dark';
}

export const LogoPreview: React.FC<LogoPreviewInterface> = ({ logotype, name, mode: _mode }) => {
  const { t } = useTranslation();
  const { colorScheme, preferredColorScheme } = useGui();

  const currentColorScheme = colorScheme === 'system' ? preferredColorScheme : colorScheme;

  const mode = _mode ?? currentColorScheme;

  const property = `url${capitalize(mode)}Mode` as 'urlLightMode' | 'urlDarkMode';
  const url = logotype?.[property] ?? logotype.urlLightMode;

  return (
    <Logo
      inverted={_mode && currentColorScheme !== _mode}
      symbol={
        <div className="h-full w-full flex items-center justify-center">
          <Image src={url.startsWith('blob') ? url : apiURL(url)} width="75" height="75" className="h-auto" alt="" />
        </div>
      }
      title={appName()}
      subtitle={name ?? t('common:preview')}
    />
  );
};
