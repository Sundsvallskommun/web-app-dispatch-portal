import { useMessageStore } from '@services/recipient-service';
import { AutoTable, AutoTableHeader, Button, Icon, Label } from '@sk-web-gui/react';
import { Trash } from 'lucide-react';
import { formSendType } from 'src/constants';
import { SendType } from 'src/types';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { createDeliveryMethodMap, formatPersonNumber } from '@utils/helpers';
import { Recipient } from 'src/data-contracts/backend/data-contracts';

interface RecipientTableProps {
  showRemoveButton?: boolean;
  sendType?: SendType;
}

export const RecipientTable: React.FC<RecipientTableProps> = ({
  showRemoveButton = false,
  sendType = formSendType.MAIL,
}) => {
  const { t } = useTranslation(['common', 'send-mail']);

  const recipients = useMessageStore((state) => state.recipients);
  const addresses = useMessageStore((state) => state.addresses);
  const validRecipients = recipients;

  const combinedLength = validRecipients.length + addresses.length;
  const setRecipients = useMessageStore((state) => state.setRecipients);
  const setAddresses = useMessageStore((state) => state.setAddresses);

  const handleRemoveOneRecipient = (personNumber: string) => {
    const result = recipients.filter((recipient) => personNumber !== recipient.personNumber);
    setRecipients(result);
  };

  const handleRemoveOneWidthAddress = (address: Recipient) => {
    const result = addresses.filter((a) => JSON.stringify(a) !== JSON.stringify(address));
    setAddresses(result);
  };

  const removeButton: Array<AutoTableHeader> = showRemoveButton
    ? [
        {
          label: t('common:remove'),
          screenReaderOnly: true,
          columnPosition: 'right',
          renderColumn: (_value, item) => (
            <div className="flex flex-1 justify-end text-right">
              <Button
                data-cy="delete-person-button"
                aria-label="Ta bort mottagare"
                variant="tertiary"
                className="relative"
                onClick={() =>
                  item?.personNumber
                    ? handleRemoveOneRecipient(item?.personNumber ?? '')
                    : handleRemoveOneWidthAddress(item as Recipient)
                }
                leftIcon={<Icon icon={<Trash />} />}
                showBackground
              >
                {t('common:remove')}
              </Button>
            </div>
          ),
          isColumnSortable: false,
        },
      ]
    : [];

  const AutoTableHeaderRecipient = {
    label: t('send-mail:reviewHandler.recipients'),
    isColumnSortable: false,
    renderColumn: (_value, item: Recipient) => {
      return (
        <div data-cy="person">
          <p data-cy="person-name">
            {item?.address?.firstName} {item?.address?.lastName}
          </p>
          {item?.personNumber && <p data-cy="person-number">{formatPersonNumber(item?.personNumber)}</p>}
        </div>
      );
    },
  } as AutoTableHeader;

  const AutoTableHeaderAddress = {
    label: t('send-mail:reviewHandler.address'),
    isColumnSortable: false,
    renderColumn: (_value, item: Recipient) => {
      // Added with address
      if (item?.address) {
        const { street, zipCode, city } = item.address;

        return (
          <>
            <span>{street},</span>
            <span>{[zipCode, city].join(' ')}</span>
          </>
        );
      }
    },
  } as AutoTableHeader;

  const AutoTableHeaderDeliveryMethod: AutoTableHeader = {
    label: t('send-mail:reviewHandler.deliveryMethod'),
    isColumnSortable: false,
    renderColumn: (_value, item) => {
      const deliveryMethodMap = createDeliveryMethodMap(t('send-mail:mail'), t('send-mail:digital'));
      const deliveryMethodColorMap = createDeliveryMethodMap('tertiary', 'vattjom');

      const deliveryMethod = item?.deliveryMethod;
      return deliveryMethodMap[deliveryMethod] ? (
        <Label data-cy="delivery-method" rounded={true} color={deliveryMethodColorMap[deliveryMethod]} inverted={true}>
          {deliveryMethodMap[deliveryMethod]}
        </Label>
      ) : (
        <></>
      );
    },
  };

  const headers: Array<AutoTableHeader | string> =
    sendType === formSendType.REK_MAIL
      ? [AutoTableHeaderRecipient]
      : [AutoTableHeaderRecipient, AutoTableHeaderAddress, AutoTableHeaderDeliveryMethod];

  return (
    <AutoTable
      footer={combinedLength > 16}
      pageSize={16}
      data-cy="recipient-table"
      autodata={[...validRecipients, ...addresses]}
      autoheaders={[...headers, ...removeButton]}
    />
  );
};
