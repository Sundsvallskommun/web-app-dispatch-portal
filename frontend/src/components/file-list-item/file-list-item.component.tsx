import { Attachment } from '@components/attachment-handler/attachment-handler';
import { Button, cx, Icon } from '@sk-web-gui/react';
import { File, Trash } from 'lucide-react';
import { useTranslation } from 'next-i18next';
import React from 'react';

function formatBytes(bytes: number, decimals = 2) {
  if (!+bytes) return '0 Bytes';

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
}

interface FileListItemComponentProps extends React.ComponentPropsWithoutRef<'div'> {
  data: Attachment & { index?: number };
  handleRemove?: (index: number) => void;
  noBorder?: boolean;
}

export const FileListItemComponent: React.FC<FileListItemComponentProps> = (props) => {
  const { data, handleRemove, noBorder, ...rest } = props;
  const { t } = useTranslation(['common', 'accessibility']);

  return (
    <div
      className={cx(
        'w-full grow flex flex-wrap rounded-button p-12 justify-between gap-16',
        noBorder ? '' : 'border-1'
      )}
      {...rest}
    >
      <div className="flex gap-16 items-center">
        <div className="bg-vattjom-surface-accent p-10 gap-8 rounded-utility max-w-[44px] max-h-[44px]">
          <Icon icon={<File />} />
        </div>

        <div className="flex flex-col w-full gap-2 grow">
          <span className="text-base">
            <strong data-cy="file-name" className="text-secondary break-all">
              {data?.file?.name}
            </strong>
          </span>
          <span className="text-small text-secondary">{data?.file?.size && formatBytes(data.file.size, 0)}</span>
        </div>
      </div>
      {!!handleRemove && (
        <div className="flex flex-wrap gap-16 break-words">
          <div data-cy="delete-file-button" className="relative">
            <Button
              variant="tertiary"
              onClick={() => handleRemove(data?.index ?? 0)}
              leftIcon={<Icon icon={<Trash />} />}
            >
              {t('common:remove')}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
