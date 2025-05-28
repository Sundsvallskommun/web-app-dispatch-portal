import {
  AddWithAddress,
  useMessageStore,
} from '@services/recipient-service';
import { AutoTable, AutoTableHeader, Icon } from '@sk-web-gui/react';
import React from 'react';
import Button from '@sk-web-gui/button';
import { Trash } from 'lucide-react';

export const RecipientList: React.FC = () => {
  const recipients = useMessageStore((state) => state.recipients);
  const addresses = useMessageStore((state) => state.addresses);
  const setRecipients = useMessageStore((state) => state.setRecipients);
  const setAddresses = useMessageStore((state) => state.setAddresses);

  const validRecipients = recipients.filter((rec) => !rec?.error);
  const combinedLength = validRecipients.length + addresses.length;


  const handleRemoveOneRecipient = (personNumber: string) => {
    const result = recipients.filter((recipient) => personNumber !== recipient.recipient.personnumber);
    setRecipients(result);
  };

  const handleRemoveOneWidthAddress = (address: AddWithAddress) => {
    const result = addresses.filter((a) => a !== address);
    setAddresses(result);
  };


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
          {item?.address?.givenname} {item?.address?.lastname}, {item?.address?.personNumber}
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

        const adress = item?.address?.addresses ? item?.address?.addresses[0] : undefined;
        if (!adress) return <></>;

        const { address, postalCode, city } = adress;
  
        return (
          <>
            {address}, {postalCode} {city}
          </>
        )
      }
    },
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
              onClick={() => item?.firstName ? handleRemoveOneWidthAddress(item as AddWithAddress) : handleRemoveOneRecipient(item?.recipient.personnumber)}
            >
              <Icon icon={<Trash />} />
            </Button>
        </div>
      ),
      isColumnSortable: false,
    },
  ];

  return (
    <div className="w-full">
      <AutoTable
        footer={combinedLength >= 12}
        pageSize={11}
        autodata={[...validRecipients, ...addresses]}
        autoheaders={headers}
      />
    </div>
  );
};
