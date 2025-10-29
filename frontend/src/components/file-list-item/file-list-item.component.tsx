import { Button, cx, Icon, Tooltip } from '@sk-web-gui/react';
import React from 'react';
import { Attachment } from '@components/attachment-handler/attachment-handler';
import { File, Trash } from 'lucide-react';
import { useTranslation } from 'next-i18next';

function formatBytes(bytes: number, decimals = 2) {
  if (!+bytes) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

interface FileListItemComponentProps {
  data: Attachment & { index?: number };
  handleRemove: (index: number) => void;
  noBorder?: boolean;
  callback?: () => void;
}

export const FileListItemComponent: React.FC<FileListItemComponentProps> = (props) => {
  const { data, handleRemove, noBorder, callback } = props;
  const [hover, setHover] = React.useState<boolean>(false);
  const [focus, setFocus] = React.useState<boolean>(false);
  const { t } = useTranslation(['common', 'accessibility']);

  const handleHover = () => {
    setHover(true);
  };

  const handleFocus = () => {
    setFocus(true);
  };

  return (
    <div
      className={cx(
        'w-full flex flex-wrap rounded-button p-12 justify-between gap-16',
        noBorder ? '' : 'border border-1'
      )}
    >
      <div className="flex gap-16 items-center">
        <div className="bg-vattjom-surface-accent p-10 gap-8 rounded-utility max-w-[44px] max-h-[44px]">
          <Icon icon={<File />} />
        </div>

        <div className="flex flex-col w-full gap-2">
          <span className="text-base">
            <strong data-cy="file-name" className="text-secondary break-all">
              {data?.file?.name}
            </strong>
          </span>
          <span className="text-small text-secondary">{data?.file?.size && formatBytes(data.file.size, 0)}</span>
        </div>
      </div>

      <div className="flex flex-wrap gap-16 break-words">
        <div className="relative">
          <Button
            aria-label={t('accessibility:ariaLabel.removeFile')}
            iconButton
            variant="secondary"
            onClick={() => {
              if (typeof data?.index === 'number') {
                handleRemove(data.index);
              }
            }}
            onMouseEnter={handleHover}
            onMouseLeave={() => setHover(false)}
            onFocus={handleFocus}
            onBlur={() => setFocus(false)}
            className="max-w-[36px] max-h-[36px] relative border-0"
          >
            <Icon onClick={() => callback?.()} icon={<Trash />} />
            <Tooltip position="below" className={`${hover || focus ? 'absolute mt-[8rem]' : 'hidden'}`}>
              {t('delete')}
            </Tooltip>
          </Button>
        </div>
      </div>
    </div>
  );
};
