import { useEffect, useState } from 'react';
import router from 'next/router';
import { useConfirm } from '@sk-web-gui/react';
import { useTranslation } from 'react-i18next';

interface ConfirmOptions {
  warningTitle: string;
  warningText: string;
  confirmLabel?: string;
  dismissLabel?: string;
}

export function useRouteGuard(
  showWarning: boolean,
  options?: ConfirmOptions
): {
  confirm: (options?: ConfirmOptions) => Promise<boolean>;
} {
  const { t } = useTranslation();
  const [active, setActive] = useState<boolean>(false);
  const title = options?.warningTitle || t('common:unsaved_changes');
  const text = options?.warningText || t('common:do_you_want_to_leave');
  const { showConfirmation } = useConfirm();

  useEffect(() => {
    setActive(showWarning);
  }, [showWarning]);

  useEffect(() => {
    const confirmRouterChange = async (url: string) => {
      const confirm = await showConfirmation(title, text, options?.confirmLabel, options?.dismissLabel, 'info');
      if (confirm) {
        setActive(false);
        router.push(url);
      }
    };

    const handleWindowClose = (e: BeforeUnloadEvent) => {
      if (!active) return;
      e.preventDefault();
      return `${title} ${text}`;
    };

    const handleBrowseAway = (url: string) => {
      if (!active) return;
      confirmRouterChange(url);
      router.events.emit('routeChangeError');
      throw new Error('routing cancelled. Confirm to continue.');
    };

    window.addEventListener('beforeunload', handleWindowClose);
    router.events.on('routeChangeStart', handleBrowseAway);
    return () => {
      window.removeEventListener('beforeunload', handleWindowClose);
      router.events.off('routeChangeStart', handleBrowseAway);
    };
  }, [active, showConfirmation, text, title, options?.confirmLabel, options?.dismissLabel]);

  const confirmer: (options: ConfirmOptions) => Promise<boolean> = async ({
    warningTitle = title,
    warningText = text,
    confirmLabel = options?.confirmLabel,
    dismissLabel = options?.dismissLabel,
  }) => {
    if (!active) return true;
    const confirm = await showConfirmation(warningTitle, warningText, confirmLabel, dismissLabel);

    return confirm;
  };

  return { confirm: confirmer };
}
