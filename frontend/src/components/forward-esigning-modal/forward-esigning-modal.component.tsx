import { RecipientListFormModel } from '@components/recipient-handler/recipient-handler';
import { SingleRecipient } from '@components/recipient-handler/components/single-recipient.component';
import { forwardEsigning } from '@services/message-service';
import { AutoTable, AutoTableHeader, Button, Icon, Modal, useSnackbar } from '@sk-web-gui/react';
import { formatLegalId } from '@utils/helpers';
import { Trash } from 'lucide-react';
import { capitalize } from 'underscore.string';
import React, { useState } from 'react';
import { FormProvider, useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { formSendType } from 'src/constants';
import { Recipient } from 'src/data-contracts/backend/data-contracts';

interface ForwardEsigningModalProps {
  messageId: string;
  open: boolean;
  onClose: () => void;
}

const recipientName = (recipient: Recipient) =>
  `${recipient.address?.firstName ?? ''} ${recipient.address?.lastName ?? ''}`.trim();

export const ForwardEsigningModal: React.FC<ForwardEsigningModalProps> = ({ messageId, open, onClose }) => {
  const { t } = useTranslation(['statistics', 'common']);
  const snackBar = useSnackbar();
  const [recipients, setRecipients] = useState<Recipient[]>([]);
  const [sending, setSending] = useState(false);

  const formMethods = useForm<RecipientListFormModel>({ defaultValues: { recipientList: [], storeRecipients: [] } });

  const handleClose = () => {
    if (sending) return;
    setRecipients([]);
    onClose();
  };

  const handleSend = async () => {
    setSending(true);

    try {
      await forwardEsigning(
        messageId,
        recipients.flatMap((recipient) => (recipient.partyId ? [recipient.partyId] : []))
      );
      snackBar({ message: t('statistics:myStatistics.forward.success'), status: 'success' });
      setRecipients([]);
      onClose();
    } catch {
      snackBar({ message: t('statistics:myStatistics.errors.forwardEsigningFailed'), status: 'error' });
    } finally {
      setSending(false);
    }
  };

  const headers: Array<AutoTableHeader> = [
    {
      label: capitalize(t('statistics:myStatistics.recipient')),
      isColumnSortable: false,
      renderColumn: (_value, item) => {
        const recipient = item as Recipient;
        return (
          <div>
            <p>{recipientName(recipient)}</p>
            {recipient.personNumber && <p>{formatLegalId(recipient.personNumber)}</p>}
          </div>
        );
      },
    },
    {
      label: t('common:remove'),
      screenReaderOnly: true,
      columnPosition: 'right',
      isColumnSortable: false,
      renderColumn: (_value, item) => {
        const recipient = item as Recipient;
        return (
          <div className="flex flex-1 justify-end">
            <Button
              data-cy="remove-forward-recipient-button"
              aria-label={`${t('common:remove')} ${recipientName(recipient)}`}
              variant="ghost"
              disabled={sending}
              onClick={() => setRecipients((current) => current.filter((r) => r.partyId !== recipient.partyId))}
              leftIcon={<Icon icon={<Trash />} />}
            />
          </div>
        );
      },
    },
  ];

  return (
    <Modal
      show={open}
      onClose={handleClose}
      className="md:w-[60rem]"
      data-cy="forward-esigning-modal"
      label={t('statistics:myStatistics.forwardSignedDocument')}
    >
      <FormProvider {...formMethods}>
        <Modal.Content>
          <p className="pb-16">{t('statistics:myStatistics.forward.description')}</p>

          <SingleRecipient
            sendType={formSendType.DIGITAL_MAIL}
            existingPartyIds={recipients.map((recipient) => recipient.partyId)}
            onAdd={(recipient) => setRecipients((current) => [...current, recipient])}
          />

          <div className="flex flex-col gap-8">
            <h3 className="text-label-medium">
              {t('statistics:myStatistics.forward.recipients', { count: recipients.length })}
            </h3>
            {recipients.length > 0 ? (
              <AutoTable
                data-cy="forward-recipient-table"
                autodata={recipients}
                autoheaders={headers}
                pageSize={recipients.length}
                footer={false}
                tableSortable={false}
              />
            ) : (
              <p className="text-secondary">{t('statistics:myStatistics.forward.noRecipients')}</p>
            )}
          </div>
        </Modal.Content>
        <Modal.Footer className="pt-16">
          <Button variant="secondary" disabled={sending} onClick={handleClose}>
            {t('common:cancel')}
          </Button>
          <Button
            data-cy="send-forward-button"
            variant="primary"
            color="primary"
            disabled={recipients.length === 0}
            loading={sending}
            onClick={handleSend}
          >
            {t('statistics:myStatistics.forward.send')}
          </Button>
        </Modal.Footer>
      </FormProvider>
    </Modal>
  );
};
