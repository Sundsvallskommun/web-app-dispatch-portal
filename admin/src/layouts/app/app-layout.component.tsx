'use client';

import LoginGuard from '@components/login-guard/login-guard';
import { ConfirmationDialogContextProvider, GuiProvider } from '@sk-web-gui/react';
import { useLocalStorage } from '@utils/use-localstorage.hook';
import dayjs from 'dayjs';
import 'dayjs/locale/sv';
import updateLocale from 'dayjs/plugin/updateLocale';
import utc from 'dayjs/plugin/utc';
import { useShallow } from 'zustand/react/shallow';

dayjs.extend(utc);
dayjs.locale('se');
dayjs.extend(updateLocale);
dayjs.updateLocale('se', {
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
  weekdaysMin: ['S', 'M', 'T', 'O', 'T', 'F', 'L'],
});

interface AppLayoutProps {
  children?: React.ReactNode;
  locale: string;
}

export const MyAppLayout: React.FC<AppLayoutProps> = ({ locale, children }) => {
  const colorScheme = useLocalStorage(useShallow((state) => state.colorScheme));

  return (
    <html lang={locale}>
      <body>
        <GuiProvider colorScheme={colorScheme}>
          <ConfirmationDialogContextProvider>
            <LoginGuard>{children}</LoginGuard>
          </ConfirmationDialogContextProvider>
        </GuiProvider>
      </body>
    </html>
  );
};
