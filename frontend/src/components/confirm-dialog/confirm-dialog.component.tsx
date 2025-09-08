import { FormModel } from '@pages/send/mail';
import { useMessageStore } from '@services/recipient-service';
import { Button, Dialog, Icon } from '@sk-web-gui/react';
import { File, SendHorizonal } from 'lucide-react';
import { useFormContext } from 'react-hook-form';
import { RecipientTable } from 'src/recipient-table/recipient-table.component';

interface ConfirmDialogProps {
  open: boolean;
  onClose: (confirm: boolean) => void;
}

export const ConfirmDialog: React.FC<ConfirmDialogProps> = ({ open, onClose }) => {
  const { watch } = useFormContext<FormModel>();
  const recipients = useMessageStore((state) => state.recipients);
  const addresses = useMessageStore((state) => state.addresses);
  const documents = watch('attachmentList');
  const department = watch('department');
  const subject = watch('subject');

  const validRecipients = recipients.filter((rec) => !rec?.error);
  const combinedLength = validRecipients.length + addresses.length;

  return (
    <Dialog show={open} className="md:min-w-[82rem]">
      <Dialog.Content>
        <h1 className="text-label-medium">Granska utskick</h1>
        <h2 className="text-body text-base font-bold">Dokument ({documents.length})</h2>
        {documents.length > 0 && (
          <ul className="flex flex-col gap-8 mb-40">
            {documents.map((doc, docIdx) => (
              <li key={`doc-${docIdx}`} className="flex items-center gap-12 border-1 p-12 mb-8 rounded">
                <div className="text-vattjom-text-primary bg-vattjom-surface-accent p-6 rounded-utility max-w-[32px] max-h-[32px]">
                  <Icon size="1.8rem" icon={<File />} />
                </div>
                <span className="text-secondary text-base font-bold">{doc?.file?.name}</span>
              </li>
            ))}
          </ul>
        )}

        <h2 className="text-body text-base font-bold">Mottagare ({combinedLength})</h2>
        <RecipientTable />

        <ul className="flex flex-col gap-8 mt-40">
          <li>
            Ämne: <strong>{subject}</strong>
          </li>
          <li>
            Avsändare: <strong>{department}</strong>
          </li>
        </ul>
      </Dialog.Content>
      <Dialog.Buttons className="justify-end">
        <Button variant="secondary" onClick={() => onClose(false)}>
          Avbryt
        </Button>
        <Button variant="primary" color="vattjom" rightIcon={<SendHorizonal />} onClick={() => onClose(true)}>
          Skicka
        </Button>
      </Dialog.Buttons>
    </Dialog>
  );
};
