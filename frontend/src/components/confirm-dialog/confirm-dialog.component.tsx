import { FormModel } from '@pages/send/mail';
import { useMessageStore } from '@services/recipient-service';
import { Button, Dialog } from '@sk-web-gui/react';
import { FileText } from 'lucide-react';
import { useFormContext } from 'react-hook-form';

interface ConfirmDialogProps {
  open: boolean;
  onClose: (confirm: boolean) => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({ open, onClose }) => {
  const { watch } = useFormContext<FormModel>();
  const recipients = useMessageStore((state) => state.recipients);
  const documents = watch('attachmentList');
  const department = watch('department');
  const subject = watch('subject');

  return (
    <Dialog show={open} className="md:min-w-[50rem]">
      <Dialog.Content>
        <h1 className="h3">Skicka post?</h1>
        <p>Vill du skicka följande dokument?</p>
        {documents.length > 0 && (
          <ul className="flex flex-col gap-8 mb-16">
            {documents.map((doc, docIdx) => (
              <li key={`doc-${docIdx}`} className="flex items-center gap-8">
                <FileText />
                {doc?.file?.name}
              </li>
            ))}
          </ul>
        )}
        <ul className="flex flex-col gap-8">
          <li>
            Antal mottagare: <strong>{recipients.filter((rec) => !rec.error).length}</strong>
          </li>
          <li>
            Förvaltning: <strong>{department}</strong>
          </li>
          <li>
            Ämne: <strong>{subject}</strong>
          </li>
        </ul>
      </Dialog.Content>
      <Dialog.Buttons>
        <Button variant="secondary" onClick={() => onClose(false)}>
          Nej
        </Button>
        <Button variant="primary" color="success" onClick={() => onClose(true)}>
          Ja, skicka
        </Button>
      </Dialog.Buttons>
    </Dialog>
  );
};
