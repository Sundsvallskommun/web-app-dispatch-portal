import React, { ReactNode } from 'react';
import { cx } from '@sk-web-gui/react';

interface HandlerWrapperProps {
  title: string;
  description: string | JSX.Element;
  children: ReactNode;
  customClasses?: string | string[];
}

const HandlerWrapper = ({ title, description, children, customClasses }: HandlerWrapperProps) => {
  return (
    <div className={cx('flex flex-col items-start w-full rounded-cards shadow-50 p-32 gap-40', customClasses)}>
      <div className="w-full">
        <h4 className="pb-6">{title}</h4>
        <p className={cx('text-base pb-6 flex flex-col gap-8')}>{description}</p>
      </div>
      {children}
    </div>
  );
};

export default HandlerWrapper;
