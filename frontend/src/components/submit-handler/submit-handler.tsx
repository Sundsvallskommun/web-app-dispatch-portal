import { ConfirmDialog } from '@components/confirm-dialog/confirm-dialog.component';
import { FormModel } from '@pages/index';
import { sendMessage } from '@services/message-service';
import { useMessageStore } from '@services/recipient-service';
import { Button, useSnackbar } from '@sk-web-gui/react';
import { SendHorizonal } from 'lucide-react';
import { useState } from 'react';
import { useFormContext } from 'react-hook-form';

const SubmitHandler: React.FC = () => {
  const [isSending, setIsSending] = useState(false);
  const recipients = useMessageStore((state) => state.recipients);
  const setResponse = useMessageStore((state) => state.setResponse);
  const [showConfirm, setShowConfirm] = useState<boolean>(false);
  const message = useSnackbar();
  const {
    getValues,
    formState: { isValid },
  } = useFormContext<FormModel>();

  const send = () => {
    setIsSending(true);
    sendMessage(
      getValues(),
      recipients.filter((r) => !r.error)
    )
      .then((res) => {
        setIsSending(false);
        message({ message: 'Post skickades', status: 'success' });
        setResponse(res);
      })
      .catch((e) => {
        console.error(e);
        setIsSending(false);
        message({ message: 'Något gick fel', status: 'error' });
      });
  };

  const handleConfirm = (confirm: boolean) => {
    setShowConfirm(false);
    if (confirm) {
      send();
    }
  };

  return (
    <>
      <Button
        variant="primary"
        color="vattjom"
        disabled={recipients.filter((r) => !r.error).length === 0 || !isValid}
        rightIcon={<SendHorizonal />}
        loading={isSending}
        loadingText="Skickar..."
        onClick={() => setShowConfirm(true)}
      >
        Skicka
      </Button>
      <ConfirmDialog open={showConfirm} onClose={handleConfirm} />
    </>
  );
};

export default SubmitHandler;
