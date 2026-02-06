import { RecipientTable } from '@components/recipient-table/recipient-table.component';
import { useMessageStore } from '@services/recipient-service';
import { cx } from '@sk-web-gui/react';
import { useTranslation } from 'react-i18next';
import { formSendType } from 'src/constants';
import { ReviewHandlerProps } from '../review-handler.component';

type ReviewRecipentsTableProps = React.ComponentPropsWithoutRef<'div'> & ReviewHandlerProps;

export const ReviewRecipientsTable: React.FC<ReviewRecipentsTableProps> = ({ sendType, className }) => {
  const { t } = useTranslation();
  const recipients = useMessageStore((state) => state.recipients);
  const addresses = useMessageStore((state) => state.addresses);
  const combinedLength = recipients.length + addresses.length;

  return (
    combinedLength > 0 && (
      <div data-cy="recipient-table" className={cx(className, 'mb-16')}>
        <h3 className="text-label-medium">
          {t('send-mail:reviewHandler.recipients')} {sendType === formSendType.MAIL && `(${combinedLength})`}
        </h3>
        <RecipientTable sendType={sendType} showRemoveButton={false} />
      </div>
    )
  );
};
