import { cx } from '@sk-web-gui/react';
import { ReactNode } from 'react';
import { usePreventBodyScroll } from 'src/hooks/usePreventBodyScroll';

export interface ICustomModalProps {
  children: ReactNode;
  show: boolean;
  onClose?: () => void;
}

const CustomModal = ({ children, show, onClose }: ICustomModalProps) => {
  usePreventBodyScroll(show);

  // when the user clicks the overlay background, close the modal
  const handleOverlayClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    // prevent closing if the user clicks inside the modal content
    if (e.target === e.currentTarget) onClose?.();
  };

  return (
    <div>
      <button
        className={cx(show ? 'sk-modal-wrapper cursor-default' : 'fixed')}
        tabIndex={0}
        onClick={handleOverlayClick}
        aria-label="Close modal by clicking the background"
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') onClose?.();
          if (e.key === 'Escape') onClose?.();
        }}
      ></button>
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
    </div>
  );
};

export default CustomModal;
