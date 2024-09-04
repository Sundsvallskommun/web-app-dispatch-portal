import { Button, Icon, Tooltip } from '@sk-web-gui/react';
import React from 'react';
import { Attachment } from '@components/attachment-handler/attachment-handler';

interface FileListItemComponentProps {
  data: Attachment & { index?: number };
  handleRemove: (index: number, main?: boolean) => void;
  handleMain?: (index: number) => void;
}

export const FileListItemComponent: React.FC<FileListItemComponentProps> = (props) => {
  const { data, handleRemove, handleMain } = props;

  const [hover, setHover] = React.useState<boolean>(false);
  const [focus, setFocus] = React.useState<boolean>(false);

  const handleHover = () => {
    setHover(true);
  };

  const handleFocus = () => {
    setFocus(true);
  };

  return (
    <div className="w-full flex flex-wrap rounded-button bg-background-color-mixin-1 p-16 mb-8 justify-between gap-16">
      <div className="flex gap-16">
        <div className="bg-vattjom-surface-accent p-6 gap-8 rounded-utility max-w-[36px] max-h-[36px]">
          <Icon name="file-text" />
        </div>

        <span className="w-full gap-8 p-6 text-base">{data.file.name}</span>
      </div>

      <div className="flex flex-wrap gap-16 break-words">
        {data.index !== 0 && (
          <Button
            variant="secondary"
            size="sm"
            onClick={() => handleMain(data.index)}
            aria-label="Ta bort fil"
            className="px-14 py-16"
          >
            Lägg först i listan
          </Button>
        )}

        <div className="relative">
          <Button
            aria-label="Ta bort fil"
            iconButton
            variant="tertiary"
            onClick={() => handleRemove(data.index, data.main)}
            onMouseEnter={handleHover}
            onMouseLeave={() => setHover(false)}
            onFocus={handleFocus}
            onBlur={() => setFocus(false)}
            className="max-w-[36px] max-h-[36px] relative"
          >
            <Icon name="trash" />
            <Tooltip position="below" className={`${hover || focus ? 'absolute mt-[8rem]' : 'hidden'}`}>
              {' '}
              Radera{' '}
            </Tooltip>
          </Button>
        </div>
      </div>
    </div>
  );
};
