import { Icon } from '@sk-web-gui/react';
import { CircleX } from 'lucide-react';

export interface ICustomAlertProps {
  title?: string;
}

const CustomAlert = ({ title = '' }: ICustomAlertProps) => {
  return (
    <div className="flex max-w-full min-w-48 pt-8 pr-12 pb-8 pl-16 items-start gap-12 self-stretch rounded-button border-1 border-error-surface-primary bg-error-background-100">
      <div className="flex w-20 h-32 py-6 self-stretch">
        <Icon icon={<CircleX />} className="w-20 h-20 text-error-text-primary" />
      </div>
      <div className="flex py-4 flex-col content-center items-start gap-6 flex-1">{title}</div>
    </div>
  );
};

export default CustomAlert;
