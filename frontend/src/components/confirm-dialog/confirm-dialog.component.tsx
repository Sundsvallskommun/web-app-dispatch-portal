import { FormModel } from '@pages/send/mail';
import { useMessageStore } from '@services/recipient-service';
import { Button, Dialog, AutoTable, AutoTableHeader, Icon } from '@sk-web-gui/react';
import { SendHorizonal } from 'lucide-react';
import { useFormContext } from 'react-hook-form';
import { File } from 'lucide-react';

interface ConfirmDialogProps {
  open: boolean;
  onClose: (confirm: boolean) => void;
}

const headers: Array<AutoTableHeader | string> = [
  {
    label: 'Mottagare',
    renderColumn: (value, item) => {
      
      // Added with address
      if (item?.firstName) {
        return (<>
          {item?.firstName} {item?.lastName}
        </>)
      }

      // Added with file or SSN
      return (<>
        {item?.address?.givenname} {item?.address?.lastName}, {item?.address?.personNumber}
      </>)
  }
  },
  {
    label: 'Adress',
    renderColumn: (value, item) => {
      // Added with address
      if (item?.firstName) {
        const { address, zipCode, city } = item;

        return (<>
          {address}, {zipCode} {city}
        </>)
      }

      const adress = item?.address?.addresses[0];
      if (!adress) return <></>;

      const { address, postalCode, city } = adress;

      return (
        <>
          {address}, {postalCode} {city}
        </>
      )
    }
  },
];

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
        <AutoTable
          footer={combinedLength >= 12}
          pageSize={11}
          autodata={[...validRecipients, ...addresses]}
          autoheaders={headers}
        />

      <ul className="flex flex-col gap-8 mt-40">
        {/*<li>
          Antal mottagare: <strong>{recipients.filter((rec) => !rec.error).length}</strong>
        </li>*/}
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
