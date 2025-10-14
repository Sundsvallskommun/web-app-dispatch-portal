import { RecipientHandlerSendType } from '@components/recipient-handler/recipient-handler';
import { AddWithAddress, useMessageStore } from '@services/recipient-service';
import { AutoTable, AutoTableHeader, Button, Icon } from '@sk-web-gui/react';
import { Trash } from 'lucide-react';
import { formSendType } from 'src/constants';

interface RecipientTableProps {
  showRemoveButton?: boolean;
  sendType?: RecipientHandlerSendType;
}

export const RecipientTable: React.FC<RecipientTableProps> = ({
  showRemoveButton = false,
  sendType = formSendType.MAIL,
}) => {
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
          renderColumn: (value, item) => (
            <div className="flex flex-1 justify-end text-right">
              <Button
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
    label: 'Mottagare',
    isColumnSortable: sendType === formSendType.MAIL,
    renderColumn: (value, item) => {
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
        <>
          {item?.address?.givenname} {item?.address?.lastname}, {item?.address?.personNumber}
        </>
      );
    },
  } as AutoTableHeader;

  const AutoTableHeaderAddress = {
    label: 'Adress',
    renderColumn: (value, item) => {
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

  const headers: Array<AutoTableHeader | string> =
    sendType === formSendType.REK_MAIL
      ? [AutoTableHeaderRecipient]
      : [AutoTableHeaderRecipient, AutoTableHeaderAddress];

  return (
    <AutoTable
      footer={combinedLength >= 12}
      pageSize={11}
      autodata={[...validRecipients, ...addresses]}
      autoheaders={[...headers, ...removeButton]}
    />
  );
};
