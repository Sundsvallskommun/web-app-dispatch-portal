import DefaultLayout from '@layouts/default-layout/default-layout.component';
import { PageHeader } from '@layouts/page-header/page-header.component';
import { useRouter } from 'next/router';
import { Chip, Breadcrumb, Spinner } from '@sk-web-gui/react';
import { useMessage } from '@services/my-statistics-service';
import dayjs from 'dayjs';
import { Message } from '@interfaces/statistics.interface';

const defaultMessageInfo: Message = {
  sent: '',
  subject: '',
  messageId: '',
  issuer: '',
  recipients: [],
  attachments: [],
};

export default function MyStatisticsDetails() {
  const router = useRouter();
  const id = Array.isArray(router.query.id) ? router.query.id[0] : router.query.id;

  const { message, loaded } = useMessage(id ?? '');
  const { recipients, sent } = message ?? defaultMessageInfo;

  const recipientList = recipients?.filter(
    (r) => r.status === 'SENT'
  );

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
              <Breadcrumb.Link>Sms</Breadcrumb.Link>
            </Breadcrumb.Item>
          </Breadcrumb>
        </PageHeader>
      }
    >
    {!loaded ?
      <Spinner />
      :
      <div className="w-full max-w-screen-small-device-max mx-auto p-32 bg-white shadow-50 rounded-14">
        <h1 className="text-h4-lg mb-8">Sms</h1>
        <p className="mb-40">{sent ? dayjs(sent).format('YYYY-MM-DD, HH:mm') : ''}</p>

        <h3 className="pb-16 text-label-medium">Mottagare ({recipientList.length})</h3>
        <div className="flex flex-col items-start gap-6 mb-40">
          {recipientList?.map((recipient, index) => (
            <Chip className="" key={index}>
              {recipient?.personId ?? 'OKÄNT'}
            </Chip>
          ))}
        </div>

        <h3 className="pb-4 text-label-medium">Meddelande</h3>
        <div className="border-1 border-divider p-20 rounded-8">
          {message.subject}
        </div>
        {/* <div className="flex flex-col gap-32 justify-start max-w-[120rem]">
          {id ? <p>Details for ID: {id}</p> : <p>Loading...</p>}
        </div> */}
      </div>}
    </DefaultLayout>
  );
}
