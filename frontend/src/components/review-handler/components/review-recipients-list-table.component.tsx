import { FileListItemComponent } from '@components/file-list-item/file-list-item.component';
import { cx } from '@sk-web-gui/react';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

type ReviewRecipientListTableProps = React.ComponentPropsWithoutRef<'div'>;

export const ReviewRecipientListTable: React.FC<ReviewRecipientListTableProps> = ({ className }) => {
  const { t } = useTranslation();
  const { watch } = useFormContext();
  const fileList = watch('recipientList');

  return (
    fileList?.length > 0 && (
      <div data-cy="recipient-file-list" className={cx(className, 'mb-16')}>
        <h3 className="text-label-medium">{t('send-mail:reviewHandler.recipientlist')}</h3>
        <FileListItemComponent noBorder data={fileList[0]} />
      </div>
    )
  );
};
