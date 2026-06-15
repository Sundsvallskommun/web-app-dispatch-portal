import { Button, cx, Icon } from '@sk-web-gui/react';
import { formatLegalId } from '@utils/helpers';
import { Check, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { formSendType } from 'src/constants';
import { Recipient } from 'src/data-contracts/backend/data-contracts';
import { SendType } from 'src/types';

interface PreviewRecipientProps {
  recipient: Recipient | undefined;
  loading?: boolean;
  handleSubmit: () => void;
  sendType: SendType;
  searchValue: string;
}

const PreviewRecipient = ({ recipient, loading, handleSubmit, sendType, searchValue }: PreviewRecipientProps) => {
  const isEligible = recipient?.deliveryMethod !== 'DELIVERY_NOT_POSSIBLE';
  const successClasses = 'border-gronsta-surface-primary bg-gronsta-background-100';
  const errorClasses = 'border-error-surface-primary bg-error-background-100';
  const { t } = useTranslation(['send-mail']);
  const eligibleStatus = isEligible ? 'success' : 'error';
  const isRekMail = sendType === formSendType.REK_MAIL;
  const isOrganization = !!recipient?.orgNumber;
  const personNumberIsEqual = recipient?.personNumber === searchValue.replace('-', '');
  const orgNumberIsEqual = recipient?.orgNumber === searchValue.replace('-', '');
  const show = !!recipient && (personNumberIsEqual || orgNumberIsEqual) && !loading && !(isOrganization && isRekMail);

  const alert = (
    <div
      data-cy="preview-recipient-error"
      className={cx(
        'flex items-center gap-6 border-1 rounded-utility p-8 mt-16',
        isEligible ? successClasses : errorClasses
      )}
    >
      <Icon color={isEligible ? 'success' : 'error'} icon={isEligible ? <Check /> : <X />} />
      {isRekMail
        ? t(`send-mail:recipientHandler.rekMail.${eligibleStatus}`)
        : t(`send-mail:recipientHandler.singleRecipient.error.${recipient?.reason}`, {
            defaultValue: t(`send-mail:recipientHandler.singleRecipient.error.default`),
          })}
    </div>
  );

  return show ? (
    <div
      data-cy="preview-recipient"
      className="shadow-50 bg-background-content -mt-32 p-16 rounded-button border-1 border-divider w-full z-10"
    >
      <p className="text-body text-base font-bold">
        {isOrganization
          ? recipient?.address?.organizationName
          : `${recipient?.address?.firstName ?? ''} ${recipient?.address?.lastName ?? ''}`.trim()}
      </p>
      <p className="text-small">{formatLegalId(recipient?.personNumber ?? recipient?.orgNumber ?? '')}</p>
      {sendType === formSendType.MAIL && recipient?.address?.street && (
        <p className="text-small">
          {recipient?.address?.street}, {recipient?.address?.city}
        </p>
      )}
      {isRekMail && isEligible && alert}

      {isEligible ? (
        <Button className="mt-16" color="vattjom" onClick={() => handleSubmit()}>
          {t('send-mail:recipientHandler.addRecipient')}
        </Button>
      ) : (
        alert
      )}
    </div>
  ) : null;
};

export default PreviewRecipient;
