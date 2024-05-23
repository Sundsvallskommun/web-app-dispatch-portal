import { DigitalMailContent, MessageInformation, SnailMailContent } from '@interfaces/batch-status';
import { getMessagesForBatch } from '@services/message-service';
import { AutoTable, Spinner, useSnackbar } from '@sk-web-gui/react';
import dayjs from 'dayjs';
import { FileText } from 'lucide-react';
import { useEffect, useState } from 'react';

const StatusHandler: React.FC<{ id: string }> = ({ id }) => {
  const [messages, setMessages] = useState<MessageInformation[]>();
  const [isLoadingStatus, setIsLoadingStatus] = useState(false);
  const message = useSnackbar();

  useEffect(() => {
    if (id) {
      setIsLoadingStatus(true);
      getMessagesForBatch(id)
        .then((res) => {
          setMessages(res);
          setIsLoadingStatus(false);
        })
        .catch((e) => {
          console.error(e);
          setIsLoadingStatus(false);
          message({ message: 'Något gick fel när meddelanden hämtades', status: 'error' });
        });
    }
  }, [id, message]);

  const getAttachments = () => {
    let attachments: Record<string, string>[] = [];
    if (messages) {
      for (let messageI = 0; messageI < messages.length; messageI++) {
        for (let deliveryI = 0; deliveryI < messages[messageI].deliveries.length; deliveryI++) {
          if (messages[messageI].deliveries[deliveryI].delivery.content.attachments.length > 0) {
            attachments = messages[messageI].deliveries[deliveryI].delivery.content.attachments;
            break;
          }
        }
        if (attachments.length > 0) {
          break;
        }
      }
    }
    return attachments;
  };

  const findDeliveryContentWithType = (type: 'DIGITAL_MAIL' | 'SNAIL_MAIL') => {
    if (messages) {
      const message = messages.find(
        (message) => message.deliveries.findIndex((del) => del.delivery.messageType === type) > -1
      );

      return message?.deliveries.find((del) => del.delivery.messageType === type)?.delivery?.content;
    }
  };

  const getDigitalMailContent = (): DigitalMailContent => {
    return findDeliveryContentWithType('DIGITAL_MAIL') as DigitalMailContent;
  };
  const getSnailMailContent = (): SnailMailContent => {
    return findDeliveryContentWithType('SNAIL_MAIL') as SnailMailContent;
  };

  return isLoadingStatus || !messages ? (
    <div className="w-full h-full flex justify-center items-center">
      <Spinner className="h-40 w-40" />
    </div>
  ) : (
    <>
      <div className="flex flex-col gap-16 w-full">
        <h2>Utskick</h2>
        <ul>
          <li>
            <strong>Avsändare, epost: </strong>
            {getDigitalMailContent()?.sender?.supportInfo?.emailAddress}
          </li>
          <li>
            <strong>Avsändare, telefonnummer: </strong>
            {getDigitalMailContent()?.sender?.supportInfo?.phoneNumber}
          </li>
          <li>
            <strong>Avsändare, url: </strong>
            {getDigitalMailContent()?.sender?.supportInfo?.url}
          </li>
          <li>
            <strong>Avsändare, förvaltning: </strong>
            {getSnailMailContent()?.department}
          </li>
          <li>
            <strong>Ämne: </strong>
            {getDigitalMailContent()?.subject}
          </li>
          <li>
            <strong>Text: </strong>
            {getDigitalMailContent()?.body}
          </li>
          <li>
            <strong>Datum: </strong>
            {dayjs(getDigitalMailContent()?.timestamp).format('YYYY-MM-DD')}
          </li>
        </ul>
        <AutoTable
          captionTitle="Dokument"
          summary="Bilagor"
          background
          className="w-full"
          tableSortable={true}
          autoheaders={[
            {
              property: 'filename',
              label: 'Bilaga',
              isColumnSortable: false,
              renderColumn: (value) => {
                return (
                  <span className="flex gap-8">
                    <FileText />
                    {value}
                  </span>
                );
              },
            },
          ]}
          autodata={getAttachments()}
        ></AutoTable>
      </div>
      {/* <div className="flex flex-col gap-16  w-full">
        <h2>Leveranser</h2>
        <AutoTable
          captionTitle="Leveranser"
          captionClassName="inline"
          tableSortable={true}
          variant="datatable"
          background
          className="w-full"
          autoheaders={[
            {
              property: 'deliveries.0.recipient.lastname',
              label: 'Namn',
              renderColumn: (value, item) => {
                return (
                  <span>
                    {value}, {item?.deliveries[0].recipient.givenname}
                  </span>
                );
              },
            },
            {
              property: 'deliveries.0.recipient.addresses.0.address',
              label: 'Adress',
              renderColumn: (value, item) => {
                return (
                  <span>
                    {value} {item?.deliveries[0].recipient?.addresses[0]?.addressNumber}{' '}
                    {item?.deliveries[0].recipient?.addresses[0]?.addressLetter},{' '}
                    {item?.deliveries[0].recipient?.addresses[0]?.postalCode}{' '}
                    {item?.deliveries[0].recipient?.addresses[0]?.city}{' '}
                    {item?.deliveries[0].recipient?.addresses[0]?.country}
                  </span>
                );
              },
            },
            {
              property: 'status',
              label: 'Status',
              renderColumn: (value) => {
                return (
                  <Label rounded inverted color={getStatusColor(value)}>
                    {getReadableStatus(value)}
                  </Label>
                );
              },
            },
          ]}
          autodata={messages.map((message) => {
            // TODO Here we show the first messageType for which the delivery status===SENT, otherwise we show FAILED
            // meaning that until some delivery is SENT, the status is FAILED meaning that the status to the user seems
            // to be FAILED although the second delivery has not yet been processed
            return {
              ...message,
              status: 'FAILED',
              // status:
              //   message?.deliveries?.find((del) => del.delivery.status === 'SENT')?.delivery.messageType || 'FAILED',
            };
          })}
        ></AutoTable>
      </div> */}
    </>
  );
};

export default StatusHandler;
