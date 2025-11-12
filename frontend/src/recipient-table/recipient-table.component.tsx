import { AddWithAddress, useMessageStore } from '@services/recipient-service';
import { AutoTable, AutoTableHeader, Button, Icon, Label } from '@sk-web-gui/react';
import { Trash } from 'lucide-react';
import { formSendType } from 'src/constants';
import { SendType } from 'src/types';
import React from 'react';
import { useTranslation } from 'react-i18next';

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
  const validRecipients = recipients.filter((rec) => !rec?.error);

  const combinedLength = validRecipients.length + addresses.length;
  const setRecipients = useMessageStore((state) => state.setRecipients);
  const setAddresses = useMessageStore((state) => state.setAddresses);

  const handleRemoveOneRecipient = (personNumber: string) => {
    const result = recipients.filter((recipient) => personNumber !== recipient.recipient.personnumber);
    setRecipients(result);
  };

  const handleRemoveOneWidthAddress = (address: AddWithAddress) => {
    const result = addresses.filter((a) => a !== address);
    setAddresses(result);
  };

  const removeButton: Array<AutoTableHeader> = showRemoveButton
    ? [
        {
          label: 'tabort',
          screenReaderOnly: true,
          columnPosition: 'right',
          renderColumn: (_value, item) => (
            <div className="flex flex-1 justify-end text-right">
              <Button
                data-cy="delete-person-button"
                aria-label="Ta bort mottagare"
                iconButton
                variant="secondary"
                className="max-w-[36px] max-h-[36px] relative border-0"
                onClick={() =>
                  item?.firstName
                    ? handleRemoveOneWidthAddress(item as AddWithAddress)
                    : handleRemoveOneRecipient(item?.recipient.personnumber)
                }
              >
                <Icon icon={<Trash />} />
              </Button>
            </div>
          ),
          isColumnSortable: false,
        },
      ]
    : [];

  const AutoTableHeaderRecipient = {
    label: t('send-mail:reviewHandler.recipients'),
    isColumnSortable: sendType === formSendType.MAIL,
    renderColumn: (_value, item) => {
      // Added with address
      if (item?.firstName) {
        return (
          <>
            {item?.firstName} {item?.lastName}
          </>
        );
      }

      // Added with file or SSN
      return (
        <div>
          <p>
            {item?.address?.givenname} {item?.address?.lastname}
          </p>
          <p>{item?.address?.personNumber}</p>
        </div>
      );
    },
  } as AutoTableHeader;

  const AutoTableHeaderAddress = {
    label: t('send-mail:reviewHandler.address'),
    renderColumn: (_value, item) => {
      // Added with address
      if (item?.firstName) {
        const { address, zipCode, city } = item;

        return (
          <>
            {address}, {zipCode} {city}
          </>
        );
      }

      const adress = item?.address?.addresses ? item?.address?.addresses[0] : undefined;
      if (!adress) return <></>;

      const { address, postalCode, city } = adress;

      return (
        <>
          {address}, {postalCode} {city}
        </>
      );
    },
  } as AutoTableHeader;

  const AutoTableHeaderDeliveryMethod: AutoTableHeader = {
    label: t('send-mail:reviewHandler.deliveryMethod'),
    isColumnSortable: true,
    renderColumn: (_value, item) => {
      const deliveryMethodMap: Record<string, string> = {
        SNAIL_MAIL: 'Post',
        DIGITAL_MAIL: 'Digitalt',
      };
      const deliveryMethodColorMap: Record<string, string> = {
        SNAIL_MAIL: 'tertiary',
        DIGITAL_MAIL: 'vattjom',
      };
      const deliveryMethod = item?.address?.deliveryMethod;
      return (
        <Label rounded={true} color={deliveryMethodColorMap[deliveryMethod]} inverted={true}>
          {deliveryMethodMap[deliveryMethod]}
        </Label>
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
