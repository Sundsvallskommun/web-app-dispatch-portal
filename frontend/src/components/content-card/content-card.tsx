import { cx } from '@sk-web-gui/react';
import { HTMLAttributes } from 'react';

export const ContentCard: React.FC<HTMLAttributes<HTMLDivElement>> = ({ className, ...rest }) => {
  return (
    <div
      className={cx(
        'rounded-cards text-base py-48 px-24 mt-40 gap-16 flex flex-col items-start justify-start',
        className
      )}
      {...rest}
    />
  );
};

export default ContentCard;
