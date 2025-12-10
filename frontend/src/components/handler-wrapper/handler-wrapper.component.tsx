import React, { ReactNode } from 'react';
import { cx } from '@sk-web-gui/react';

interface HandlerWrapperProps {
  title: string;
  description?: string | JSX.Element;
  children: ReactNode;
  customClasses?: string | string[];
  gap?: number;
}

const HandlerWrapper = ({ title, description, children, customClasses, gap = 40 }: HandlerWrapperProps) => {
  return (
    <div
      className={cx(
        'flex flex-col items-start w-full rounded-cards shadow-50 p-32 bg-background-content',
        `gap-${gap}`,
        customClasses
      )}
    >
      <div className="w-full">
        <h2 className="text-h4-sm pb-6">{title}</h2>
        {description && <p className={cx('text-secondary pb-6 flex flex-col gap-8')}>{description}</p>}
      </div>
      {children}
    </div>
  );
};

export default HandlerWrapper;
