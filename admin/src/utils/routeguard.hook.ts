import { useConfirm } from '@sk-web-gui/react';
import { useNavigationGuard } from 'next-navigation-guard';
import { useEffect, useState } from 'react';
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

  const navGuard = useNavigationGuard({ enabled: active });

  useEffect(() => {
    const confirmRouterChange = async () => {
      const confirm = await showConfirmation(title, text, options?.confirmLabel, options?.dismissLabel, 'info');
      if (confirm) {
        navGuard.accept();
        setActive(false);
      } else {
        navGuard.reject();
      }
    };
    if (navGuard.active) {
      confirmRouterChange();
    }
  }, [navGuard.active]);
  useEffect(() => {
    const handleWindowClose = (e: BeforeUnloadEvent) => {
      if (!active) return;
      e.preventDefault();
      return `${title} ${text}`;
    };

    window.addEventListener('beforeunload', handleWindowClose);
    return () => {
      window.removeEventListener('beforeunload', handleWindowClose);
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
