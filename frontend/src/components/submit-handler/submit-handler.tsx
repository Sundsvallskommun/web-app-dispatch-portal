import { FormModel } from '@pages/send/mail';
import { sendMessage } from '@services/message-service';
import { useMessageStore } from '@services/recipient-service';
import { Button, useSnackbar } from '@sk-web-gui/react';
import { SendHorizonal } from 'lucide-react';
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';

const SubmitHandler = () => {
  const [isSending, setIsSending] = useState(false);
  const { t } = useTranslation(['common', 'send-mail']);
  const recipients = useMessageStore((state) => state.recipients);
  const addresses = useMessageStore((state) => state.addresses);
  const setResponse = useMessageStore((state) => state.setResponse);
  const message = useSnackbar();
  const {
    getValues,
    formState: { isValid },
  } = useFormContext<FormModel>();

  const handleSend = () => {
    setIsSending(true);
    sendMessage(
      getValues(),
      recipients.filter((r) => !r.error),
      addresses
    )
      .then((res) => {
        setIsSending(false);
        setResponse(res);
      })
      .catch((e) => {
        console.error(e);
        setIsSending(false);
        message({ message: t('send-mail:reviewHandler.error'), status: 'error' });
      });
  };

  return (
    <Button
      variant="primary"
      color="vattjom"
      disabled={(recipients.filter((r) => !r.error).length === 0 && addresses.length === 0) || !isValid}
      rightIcon={<SendHorizonal />}
      loading={isSending}
      loadingText={'common:send'}
      onClick={() => handleSend()}
    >
      {t('common:send')}
    </Button>
  );
};

export default SubmitHandler;
