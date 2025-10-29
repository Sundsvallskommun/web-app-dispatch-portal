import { Button, Header, Icon } from '@sk-web-gui/react';
import React from 'react';
import { HelpCircle, X } from 'lucide-react';
import CustomModal from '@components/custom-modal/custom-modal.component';

export const HelpWrapper: React.FC<{
  show: boolean;
  label: string;
  closeHandler: () => void;
  children: React.ReactNode;
}> = ({ show, label = '', closeHandler, children }) => {
  return (
    <CustomModal show={show} onClose={closeHandler}>
      <Header className="h-[64px] flex justify-between" wrapperClasses="py-4 px-40">
        <div className="text-h4-sm flex items-center gap-12">
          <Icon icon={<HelpCircle />} /> {label}
        </div>
        <Button
          tabIndex={show ? 0 : -1}
          aria-label="Stäng hjälp"
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
