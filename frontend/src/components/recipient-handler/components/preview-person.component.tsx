import { Button, cx, Icon, Spinner } from '@sk-web-gui/react';
import { formatPersonNumber } from '@utils/helpers';
import { Check, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { formSendType } from 'src/constants';
import { Recipient } from 'src/data-contracts/backend/data-contracts';
import { SendType } from 'src/types';

interface PreviewPersonProps {
  person?: Recipient;
  loading?: boolean;
  handleSubmit: () => void;
  sendType: SendType;
}

const PreviewPerson = ({ person, loading, handleSubmit, sendType }: PreviewPersonProps) => {
  const isEligible = person?.deliveryMethod !== 'DELIVERY_NOT_POSSIBLE';
  const successClasses = 'border-gronsta-surface-primary bg-gronsta-background-100';
  const errorClasses = 'border-error-surface-primary bg-error-background-100';
  const { t } = useTranslation(['send-mail']);
  const eligibleStatus = isEligible ? 'success' : 'error';
  const alert = (
    <div
      className={cx(
        'flex items-center gap-6 border-1 rounded-utility p-8 mt-16',
        isEligible ? successClasses : errorClasses
      )}
    >
      <Icon color={isEligible ? 'success' : 'error'} icon={isEligible ? <Check /> : <X />} />
      {sendType === formSendType.REK_MAIL
        ? t(`send-mail:recipientHandler.rekMail.${eligibleStatus}`)
        : t(`send-mail:recipientHandler.mail.error'}`)}
    </div>
  );

  return (
    (!!person || loading) && (
      <div
        data-cy="preview-person"
        className="preview-person bg-background-100 -mt-32 p-16 rounded-button border-1 border-divider w-full z-10"
      >
        {loading && (
          <div className="my-lg flex flex-col items-center justify-center gap-sm">
            <div>
              <Spinner size={2.4} />
            </div>
            <div>{t('send-mail:recipientHandler.fetchingRecipient')}</div>
          </div>
        )}
        {!!person && (
          <>
            <p className="text-body text-base font-bold">
              {person?.address?.firstName} {person?.address?.lastName}
            </p>
            <p className="text-small">{formatPersonNumber(person?.personNumber ?? '')}</p>
            {sendType === formSendType.MAIL && (
              <p className="text-small">
                {person?.address?.street}, {person?.address?.city}
              </p>
            )}
            {sendType === formSendType.REK_MAIL && isEligible && alert}

            {isEligible ? (
              <Button className="mt-16" onClick={() => handleSubmit()}>
                {t('send-mail:recipientHandler.addRecipient')}
              </Button>
            ) : (
              alert
            )}
          </>
        )}
      </div>
    )
  );
};

export default PreviewPerson;
