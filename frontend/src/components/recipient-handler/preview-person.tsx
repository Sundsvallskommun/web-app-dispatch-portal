import { Citizenaddress } from '@services/recipient-service';
import { Button, cx, Icon, Spinner } from '@sk-web-gui/react';
import { RecipientHandlerSendType } from './recipient-handler';
import { formSendType } from 'src/constants';
import { Check, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getEligibilityKivra } from '@services/digital-registered-letter-service';
import { useTranslation } from 'react-i18next';

interface PreviewPersonProps {
  personId: string;
  personAdress: Citizenaddress | undefined;
  handleSubmit: () => void;
  sendType: RecipientHandlerSendType;
}

/* - - - Testperson med Kivra: 199011182475 - - - */

const PreviewPerson = ({ personId, personAdress, handleSubmit, sendType }: PreviewPersonProps) => {
  const [isEligible, setIsEligible] = useState<boolean>(false);
  const [isLoading, setIsloading] = useState<boolean>(false);
  const showButton = sendType === formSendType.MAIL || (isEligible && sendType === formSendType.REK_MAIL && !isLoading);
  const successClasses = 'border-gronsta-surface-primary bg-gronsta-background-100';
  const errorClasses = 'border-error-surface-primary bg-error-background-100';
  const { t } = useTranslation(['send-mail']);

  useEffect(() => {
    if (sendType === formSendType.REK_MAIL) {
      setIsloading(true);
      getEligibilityKivra([personId]).then((res) => {
        const hasKivra = res.results.some((r) => r.hasKivra);
        setIsloading(false);
        setIsEligible(hasKivra);
      });
    }
  }, [isEligible, sendType, personId]);

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
      <p className="text-small">
        {personAdress?.addresses[0].address}, {personAdress?.addresses[0].city}
      </p>
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
