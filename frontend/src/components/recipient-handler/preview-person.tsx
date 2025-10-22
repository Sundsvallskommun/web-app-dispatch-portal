import { Citizenaddress } from '@services/recipient-service';
import { Button, cx, Icon, Spinner } from '@sk-web-gui/react';
import { formSendType } from 'src/constants';
import { Check, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useKivraEligibility } from 'src/hooks/useGetEligibility';
import { SendType } from 'src/types';

interface PreviewPersonProps {
  personId: string;
  personAdress: Citizenaddress | undefined;
  handleSubmit: () => void;
  sendType: SendType;
}

const PreviewPerson = ({ personId, personAdress, handleSubmit, sendType }: PreviewPersonProps) => {
  const { isEligible, isLoading } = useKivraEligibility(personId, sendType);
  const showButton = sendType === formSendType.MAIL || (isEligible && sendType === formSendType.REK_MAIL && !isLoading);
  const successClasses = 'border-gronsta-surface-primary bg-gronsta-background-100';
  const errorClasses = 'border-error-surface-primary bg-error-background-100';
  const { t } = useTranslation(['send-mail']);

  const alert = (
    <div
      className={cx(
        'flex items-center gap-6 border-1 rounded-utility p-8 mt-16',
        isEligible ? successClasses : errorClasses
      )}
    >
      <Icon color={isEligible ? 'success' : 'error'} icon={isEligible ? <Check /> : <X />} />
      {t(`send-mail:recipientHandler.rekMail.${isEligible ? 'success' : 'error'}`)}
    </div>
  );

  return (
    <div className="preview-person bg-background-100 -mt-32 p-16 rounded-button border-1 border-divider w-full z-10">
      <p className="text-body text-base font-bold">
        {personAdress?.givenname} {personAdress?.lastname}
      </p>
      <p className="text-small">{personAdress?.personNumber}</p>
      {sendType === formSendType.MAIL && (
        <p className="text-small">
          {personAdress?.addresses[0].address}, {personAdress?.addresses[0].city}
        </p>
      )}
      {sendType === formSendType.REK_MAIL &&
        (isLoading ? (
          <div className="flex w-full items-center justify-center pt-8">
            <Spinner className="h-32 w-32" />
          </div>
        ) : (
          alert
        ))}
      {showButton && (
        <Button className="mt-16" onClick={() => handleSubmit()}>
          {t('send-mail:recipientHandler.addRecipient')}
        </Button>
      )}
    </div>
  );
};

export default PreviewPerson;
