import { FileUploadWrapper } from '@components/file-upload/file-upload.context';
import LoginGuard from '@components/login-guard/login-guard';
import { GuiProvider, defaultTheme, extendTheme } from '@sk-web-gui/react';
import '@styles/tailwind.scss';
import dayjs from 'dayjs';
import 'dayjs/locale/sv';
import updateLocale from 'dayjs/plugin/updateLocale';
import utc from 'dayjs/plugin/utc';
import type { AppProps } from 'next/app';
import { useMemo, useState } from 'react';
import { AppWrapper } from '../contexts/app.context';

dayjs.extend(utc);
dayjs.locale('sv');
dayjs.extend(updateLocale);
dayjs.updateLocale('sv', {
  months: [
    'Januari',
    'Februari',
    'Mars',
    'April',
    'Maj',
    'Juni',
    'Juli',
    'Augusti',
    'September',
    'Oktober',
    'November',
    'December',
  ],
  monthsShort: ['Jan', 'Feb', 'Mar', 'Apr', 'Maj', 'Jun', 'Jul', 'Aug', 'Sep', 'Okt', 'Nov', 'Dec'],
});

function MyApp({ Component, pageProps }: AppProps) {
  const [colorScheme] = useState('light');

  const theme = useMemo(
    () =>
      extendTheme({
        cursor: colorScheme === 'light' ? 'pointer' : 'default',
        colorSchemes: defaultTheme.colorSchemes,
      }),
    [colorScheme]
  );

  return (
    <GuiProvider theme={theme}>
      <AppWrapper>
        <LoginGuard>
          <FileUploadWrapper>
            {/* @ts-expect-error Server Component */}
            <Component {...pageProps} />
          </FileUploadWrapper>
        </LoginGuard>
      </AppWrapper>
    </GuiProvider>
  );
}

export default MyApp;
