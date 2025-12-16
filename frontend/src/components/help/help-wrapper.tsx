import { Button, Header, Icon } from '@sk-web-gui/react';
import React from 'react';
import { HelpCircle, X } from 'lucide-react';
import CustomModal from '@components/custom-modal/custom-modal.component';
import { useTranslation } from 'react-i18next';

export const HelpWrapper: React.FC<{
  show: boolean;
  label: string;
  closeHandler: () => void;
  children: React.ReactNode;
}> = ({ show, label = '', closeHandler, children }) => {
  const { t } = useTranslation(['help-menu']);
  return (
    <CustomModal show={show} onClose={closeHandler}>
      <Header className="h-[64px] flex justify-between" wrapperClasses="py-4 px-40">
        <h2 className="text-h4-sm flex items-center gap-12 m-0">
          <Icon icon={<HelpCircle />} /> {label}
        </h2>
        <Button
          tabIndex={show ? 0 : -1}
          aria-label={t('help-menu:closeHelp')}
          iconButton
          variant="tertiary"
          onClick={() => {
            closeHandler();
          }}
          data-cy="close-help-wrapper"
        >
          <Icon icon={<X />} data-cy="close-help-wrapper-icon" />
        </Button>
      </Header>
      {children}
    </CustomModal>
  );
};
