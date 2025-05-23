import DefaultLayout from '@layouts/default-layout/default-layout.component';
import { PageHeader } from '@layouts/page-header/page-header.component';
import { useRouter } from 'next/router';
import { useState } from 'react';
import { Icon, Breadcrumb, AutoTable, AutoTableHeader, Tabs, Button, Spinner, useSnackbar } from '@sk-web-gui/react';
import { File, Download } from 'lucide-react';
import { getAttachmentFile, useMessage } from '@services/my-statistics-service';
import dayjs from 'dayjs';
import { Message } from '@interfaces/statistics.interface';

const defaultMessageInfo: Message = {
  sent: '',
  subject: '',
  messageId: '',
  issuer: '',
  attachments: [],
  recipients: [],
};

const headers: Array<AutoTableHeader | string> = [
  {
    label: 'Mottagare',
    property: 'recipient',
  },
  {
    label: 'Adress',
    property: 'address',
  },
  {
    label: 'Skickades via',
    property: 'messageType',
    renderColumn: (value, item) => (
      <div className="text-right">
        {item.messageType === 'SNAIL_MAIL' ? (
          <div className="py-4 px-10 bg-tertiary-surface text-label-small rounded-button">Fysisk post</div>
        ) : (
          <div className="py-4 px-10 text-gronsta-text-primary bg-gronsta-surface-accent text-label-small rounded-button">
            Digital post
          </div>
        )}
      </div>
    ),
  },
];

export default function MyStatisticsDetails() {
  const router = useRouter();
  const id = Array.isArray(router.query.id) ? router.query.id[0] : router.query.id;
  const snackBar = useSnackbar();

  const [loadingAttachmentIndex, setoadingAttachmentIndex] = useState<number>(-1);

  const { message, loaded } = useMessage(id ?? '');
  const { recipients, attachments, sent, subject } = message ?? defaultMessageInfo;

  const recipientList = recipients?.filter(
    (r) => r.status === 'SENT'
  )?.map((r) => {
    if (r.address) {
      return ({
        recipient: `${r?.address?.firstName ?? ''} ${r?.address?.lastName ?? ''}${ r?.personId ? ',' : ''} ${r?.personId ?? ''}`,
        address: `${r?.address?.address}${ r?.address?.address ? ',' : ''} ${r?.address?.zipCode} ${r?.address?.city}`,
        messageType: r.messageType,
      });
    }
    return ({
      recipient: `${r?.personId}`,
      address: '',
      messageType: r.messageType
    });
  });

  const recipientsSnailMail = recipientList?.filter((r) => r.messageType === 'SNAIL_MAIL');
  const recipientsDigitalMail = recipientList?.filter((r) => r.messageType === 'DIGITAL_MAIL');

  const getAttachment = (fileName: string, index: number) => {
    setoadingAttachmentIndex(index);

    getAttachmentFile(id!, fileName)
      .then((d) => {
        if (typeof d.error === 'undefined') {
          const bufferArray = new Uint8Array(d.data).buffer;
          const blob = new Blob([bufferArray], {
            type: 'application/pdf',
          });
          const url = URL.createObjectURL(blob);
          const a = document.createElement("a");
          a.href = url;
          a.download = `${fileName}.pdf`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        } else {
          snackBar({
            message: `Misslyckades med att hämta filen "${fileName}"`,
            status: 'error'
          });
        }
      }).finally(() => setoadingAttachmentIndex(-1));
  };

  return (
    <DefaultLayout
      title={`Postportalen`}
      pageheader={
        <PageHeader color="transparent">
          <Breadcrumb>
            <Breadcrumb.Item>
              <Breadcrumb.Link href="/my-statistics">Dina utskick</Breadcrumb.Link>
            </Breadcrumb.Item>

            <Breadcrumb.Item currentPage>
              <Breadcrumb.Link>Brev ({subject})</Breadcrumb.Link>
            </Breadcrumb.Item>
          </Breadcrumb>
        </PageHeader>
      }
    >
    {!loaded ?
      <Spinner />
      :
      <div className="w-full max-w-screen-small-device-max mx-auto p-32 bg-white shadow-50 rounded-14">
        <h1 className="text-h4-lg mb-8">Brev ({subject})</h1>
        <p className="mb-40">{sent ? dayjs(sent).format('YYYY-MM-DD, HH:mm') : ''}</p>

        <h3 className="pb-16 text-label-medium">Textfiler ({attachments?.length})</h3>
        <div className="flex flex-col items-start gap-6 mb-40">
          {attachments?.map((file, index) => (
            <div
              className="flex items-center p-12 gap-12 w-full border-1 border-divider rounded-button"
              key={`${file.fileName}-${index}`}
            >
              <div className="bg-vattjom-surface-accent rounded-8 flex p-6">
                <Icon className="text-vattjom-text-primary" icon={<File />} />
              </div>
              <span className="flex-1 text-secondary text-base font-bold">{file.fileName}</span>
              <Button loading={loadingAttachmentIndex === index} onClick={() => getAttachment(file.fileName, index)} variant="tertiary" aria-label={`Visa Fil`}>Visa fil <Icon icon={<Download />} /></Button>
            </div>
          ))}
        </div>

        <h3 className="pb-4 text-label-medium">Mottagare</h3>
        <Tabs>
          <Tabs.Item>
            <Tabs.Button>Alla ({recipientList?.length ?? '0'})</Tabs.Button>
            <Tabs.Content>
              {recipientList?.length > 0 && <AutoTable footer={recipientList.length >= 12} pageSize={11} autodata={[...recipientList]} autoheaders={headers} />}
            </Tabs.Content>
          </Tabs.Item>
          <Tabs.Item>
            <Tabs.Button>Digital post ({recipientsDigitalMail?.length ?? '0'})</Tabs.Button>
            <Tabs.Content>
              {recipientsDigitalMail?.length > 0 && <AutoTable footer={recipientsDigitalMail.length >= 12} pageSize={11} autodata={[...recipientsDigitalMail]} autoheaders={headers} />}
            </Tabs.Content>
          </Tabs.Item>
          <Tabs.Item>
            <Tabs.Button>Fysisk post ({recipientsSnailMail?.length ?? '0'})</Tabs.Button>
            <Tabs.Content>
              {recipientsSnailMail?.length > 0 && <AutoTable footer={recipientsSnailMail.length >= 12} pageSize={11} autodata={[...recipientsSnailMail]} autoheaders={headers} />}
            </Tabs.Content>
          </Tabs.Item>
        </Tabs>
      </div>}
    </DefaultLayout>
  );
}
