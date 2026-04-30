import { Button, cx, Icon } from '@sk-web-gui/react';
import { formatLegalId } from '@utils/helpers';
import { Check, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { formSendType } from 'src/constants';
import { Recipient } from 'src/data-contracts/backend/data-contracts';
import { SendType } from 'src/types';

interface PreviewPersonProps {
  person: Recipient | undefined;
  loading?: boolean;
  handleSubmit: () => void;
  sendType: SendType;
  searchValue: string;
}

const PreviewPerson = ({ person, loading, handleSubmit, sendType, searchValue }: PreviewPersonProps) => {
  const isEligible = person?.deliveryMethod !== 'DELIVERY_NOT_POSSIBLE';
  const successClasses = 'border-gronsta-surface-primary bg-gronsta-background-100';
  const errorClasses = 'border-error-surface-primary bg-error-background-100';
  const { t } = useTranslation(['send-mail']);
  const eligibleStatus = isEligible ? 'success' : 'error';
  const personNumberIsEqual = person?.personNumber === searchValue.replace('-', '');
  const show = !!person && personNumberIsEqual && !loading;

  const alert = (
    <div
      data-cy="preview-person-error"
      className={cx(
        'flex items-center gap-6 border-1 rounded-utility p-8 mt-16',
        isEligible ? successClasses : errorClasses
      )}
    >
      <Icon color={isEligible ? 'success' : 'error'} icon={isEligible ? <Check /> : <X />} />
      {sendType === formSendType.REK_MAIL
        ? t(`send-mail:recipientHandler.rekMail.${eligibleStatus}`)
        : t(`send-mail:recipientHandler.singleRecipient.error.${person?.reason}`, {
            defaultValue: t(`send-mail:recipientHandler.singleRecipient.error.default`),
          })}
    </div>
  );

  return show ? (
    <div
      data-cy="preview-person"
      className="shadow-50 bg-background-content -mt-32 p-16 rounded-button border-1 border-divider w-full z-10"
    >
      <p className="text-body text-base font-bold">
        {person?.address?.firstName} {person?.address?.lastName}
      </p>
      <p className="text-small">{formatLegalId(person?.personNumber ?? '')}</p>
      {sendType === formSendType.MAIL && (
        <p className="text-small">
          {person?.address?.street}, {person?.address?.city}
        </p>
      )}
      {sendType === formSendType.REK_MAIL && isEligible && alert}

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

export default PreviewPerson;
