import { Button, Icon } from '@sk-web-gui/react';
import { Trash } from 'lucide-react';
import { MouseEventHandler, ReactNode } from 'react';

type ICustomChipProps = React.HTMLAttributes<HTMLDivElement> & {
  onRemove?: MouseEventHandler<HTMLButtonElement>;
  children?: ReactNode;
};

const CustomChip = ({ children, onRemove }: ICustomChipProps) => {
  return (
    <div className="border-spacing-1 border-1 border-secondary-outline rounded-button items-center py-8 px-12 flex justify-between gap-24 min-w-[20rem] hover:cursor-default">
      <div className="text-dark-secondary lining-nums proportional-nums text-base font-normal">{children}</div>
      <Button
        data-cy="delete-number-button"
        className="bg-transparent"
        size="sm"
        iconButton
        variant="tertiary"
        onClick={onRemove}
      >
        <Icon className="flex justify-center items-center gap-4 text-dark-primary" icon={<Trash />} size={20} />
      </Button>
    </div>
  );
};

export default CustomChip;
