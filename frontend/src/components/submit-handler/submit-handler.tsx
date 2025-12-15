import { FormModel } from '@pages/send/mail';
import { sendMessage, sendRecMessage } from '@services/message-service';
import { useMessageStore } from '@services/recipient-service';
import { Button, useSnackbar } from '@sk-web-gui/react';
import { SendHorizonal } from 'lucide-react';
import { useMemo, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { formSendType } from 'src/constants';
import { SendType } from 'src/types';

interface SubmitHandlerProps {
  sendType?: SendType;
}

const SubmitHandler = ({ sendType = formSendType.MAIL }: SubmitHandlerProps) => {
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

  const recipientPersonId = useMemo(() => {
    return recipients.find((r) => r.deliveryMethod !== 'DELIVERY_NOT_POSSIBLE')?.partyId;
  }, [recipients]);

  const handleNormalSend = () => {
    setIsSending(true);
    sendMessage(
      getValues(),
      recipients.filter((r) => r.deliveryMethod !== 'DELIVERY_NOT_POSSIBLE'),
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
  const handleRecSend = () => {
    if (!recipientPersonId) return;
    setIsSending(true);
    sendRecMessage(getValues(), recipientPersonId)
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
      disabled={!isValid}
      rightIcon={<SendHorizonal />}
      loading={isSending}
      loadingText={t('common:sending')}
      onClick={() => {
        if (sendType === formSendType.REK_MAIL) handleRecSend();
        else handleNormalSend();
      }}
    >
      {t('common:send')}
    </Button>
  );
};

export default SubmitHandler;
