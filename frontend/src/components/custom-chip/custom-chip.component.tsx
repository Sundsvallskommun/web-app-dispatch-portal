import { Button, Icon } from '@sk-web-gui/react';
import { Trash } from 'lucide-react';
import { MouseEventHandler, ReactNode } from 'react';

type ICustomChipProps = React.HTMLAttributes<HTMLDivElement> & {
  onRemove?: MouseEventHandler<HTMLButtonElement> | undefined;
  children?: ReactNode;
};

const CustomChip = ({ children, onRemove }: ICustomChipProps) => {
  return (
    <div>
      <div className="border-spacing-1 border-1 border-secondary-outline rounded-button items-center py-8 px-12 flex justify-center gap-24 min-w-206 hover:cursor-default">
        <div className="text-dark-secondary lining-nums proportional-nums text-base font-normal">{children}</div>
        <Button className="bg-transparent" size="sm" iconButton variant="tertiary" onClick={onRemove}>
          <Icon className="flex justify-center items-center gap-4 text-dark-primary" icon={<Trash />} size={20} />
        </Button>
      </div>
    </div>
  );
};

export default CustomChip;
