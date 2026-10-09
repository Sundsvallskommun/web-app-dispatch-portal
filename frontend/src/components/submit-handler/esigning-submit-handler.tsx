import { sendEsigning } from '@services/message-service';
import { Button, Icon, useSnackbar } from '@sk-web-gui/react';
import { SendEsigningForm } from '@utils/esigningFormSchema.yup';
import { Info, SendHorizonal } from 'lucide-react';
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

interface EsigningSubmitHandlerProps {
  onSuccess: () => void;
}

const EsigningSubmitHandler = ({ onSuccess }: EsigningSubmitHandlerProps) => {
  const [isSending, setIsSending] = useState(false);
  const { t } = useTranslation(['common', 'send-esigning']);
  const message = useSnackbar();
  const {
    getValues,
    formState: { isValid },
  } = useFormContext<SendEsigningForm>();

  const handleSend = () => {
    setIsSending(true);
    sendEsigning(getValues())
      .then(() => {
        setIsSending(false);
        onSuccess();
      })
      .catch((e) => {
        console.error(e);
        setIsSending(false);
        message({ message: t('send-esigning:reviewHandler.error'), status: 'error' });
      });
  };

  return (
    <div className="relative">
      <Button
        variant="primary"
        color="vattjom"
        disabled={!isValid}
        rightIcon={<SendHorizonal />}
        loading={isSending}
        loadingText={t('common:sending')}
        onClick={() => handleSend()}
      >
        {t('common:send')}
      </Button>
      <output className="absolute right-0 top-full mt-16 flex flex-row items-center gap-8 whitespace-nowrap text-base">
        {!isSending && (
          <>
            <Icon icon={<Info />} size={20} />
            <span>{t('send-esigning:reviewHandler.sendingInfo')}</span>
          </>
        )}
      </output>
    </div>
  );
};

export default EsigningSubmitHandler;
