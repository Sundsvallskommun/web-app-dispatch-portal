import { cx } from '@sk-web-gui/react';
import { ReactNode } from 'react';

export interface ICustomModalProps {
  children: ReactNode;
  show: boolean;
}

const CustomModal = ({ children, show }: ICustomModalProps) => {
  return (
    <>
      <div className={cx(show ? 'sk-modal-wrapper' : 'fixed')}></div>
      <section
        className={cx(
          'fixed right-0 top-0 h-full bg-background-content overflow-auto z-[20] shadow-100',
          'w-full md:w-[50vw] lg:w-[38vw]',
          'transition-transform duration-300 ease-in-out will-change-transform',
          show ? 'translate-x-0' : 'translate-x-full'
        )}
      >
        {children}
      </section>
    </>
  );
};

export default CustomModal;
