import { cx } from '@sk-web-gui/react';
import { HTMLAttributes } from 'react';

interface PageHeaderProps extends HTMLAttributes<HTMLDivElement> {
  color?: string;
}

export const PageHeader: React.FC<PageHeaderProps> = (props) => {
  const { color = 'vattjom', className, children, ...rest } = props;

  return (
    <div className={cx('PageHeader', `bg-${color}-background-100`, className)} {...rest}>
      <div className="PageHeaderContent">{children}</div>
    </div>
  );
};
