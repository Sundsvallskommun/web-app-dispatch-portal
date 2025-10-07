import { Button, Header, cx, Icon } from '@sk-web-gui/react';
import React from 'react';
import { HelpCircle, X } from 'lucide-react';

export const HelpWrapper: React.FC<{
  show: boolean;
  label: string;
  closeHandler: () => void;
  children: React.ReactNode;
}> = ({ show, label = '', closeHandler, children }) => {
  return (
    <React.Fragment>
      <div className={cx(show ? 'sk-modal-wrapper' : 'fixed')}></div>
      <section
        className={cx(
          `absolute right-0 bottom-0 top-0 bg-background-content transition-all ease-in-out duration-150 overflow-auto z-[20] shadow-100`,
          show ? 'w-full md:min-w-[50rem] md:w-[50vw] lg:w-[38vw]' : 'w-0 px-0'
        )}
      >
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
      </section>
    </React.Fragment>
  );
};
