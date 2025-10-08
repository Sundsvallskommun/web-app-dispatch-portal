import DefaultLayout from '@layouts/default-layout/default-layout.component';
import { PageHeader } from '@layouts/page-header/page-header.component';
import { useRouter } from 'next/router';
import { useState } from 'react';
import {
  Icon,
  Breadcrumb,
  AutoTable,
  AutoTableHeader,
  Tabs,
  Button,
  Spinner,
  useSnackbar,
  Divider,
  Label,
} from '@sk-web-gui/react';
import { File, Download } from 'lucide-react';
import { getAttachmentFile, useMessage } from '@services/my-statistics-service';
import dayjs from 'dayjs';
import { Message } from '@interfaces/statistics.interface';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'react-i18next';
import { capitalize } from '@mui/material';
import { isDigitalMessage } from '@utils/statistics-helpers';

const defaultMessageInfo: Message = {
  sent: '',
  subject: '',
  body: '',
  messageId: '',
  issuer: '',
  attachments: [],
  recipients: [],
};

const MyStatisticsDetails = () => {
  const router = useRouter();
  const id = Array.isArray(router.query.id) ? router.query.id[0] : router.query.id;
  const snackBar = useSnackbar();
  const { t } = useTranslation();

  const [loadingAttachmentIndex, setLoadingAttachmentIndex] = useState<number>(-1);
  const { message, loaded } = useMessage(id ?? '');
  const { recipients, attachments, sent, subject } = message ?? defaultMessageInfo;

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
      label: 'Skickat via',
      property: 'messageType',
      columnPosition: 'right',
      renderColumn: (value, item) => (
        <div className="min-w-120">
          {item.messageType === 'SNAIL_MAIL' ? (
            <Label rounded inverted>
              {t('statistics:myStatistics.snailMail_one')}
            </Label>
          ) : (
            <Label color="vattjom" rounded inverted>
              {t('statistics:myStatistics.digitalMail_one')}
            </Label>
          )}
        </div>
      ),
    },
  ];

  const recipientList = recipients
    ?.filter((r) => r.status === 'SENT')
    ?.map((r) => {
      if (r.address) {
        return {
          recipient: `${r?.address?.firstName ?? ''} ${r?.address?.lastName ?? ''}${r?.personId ? ',' : ''} ${r?.personId ?? ''}`,
          address: `${r?.address?.address}${r?.address?.address ? ',' : ''} ${r?.address?.zipCode} ${r?.address?.city}`,
          messageType: r.messageType,
        };
      }
      return {
        recipient: r?.personId ? `${r?.personId}` : 'Okänd',
        address: '',
        messageType: r.messageType,
      };
    });

  const recipientsSnailMail = recipientList?.filter((r) => !isDigitalMessage(r.messageType));
  const recipientsDigitalMail = recipientList?.filter((r) => isDigitalMessage(r.messageType));

  const getAttachment = (fileName: string, index: number) => {
    setLoadingAttachmentIndex(index);

    getAttachmentFile(id!, fileName)
      .then((d) => {
        if (typeof d.error === 'undefined') {
          const bufferArray = new Uint8Array(d.data).buffer;
          const blob = new Blob([bufferArray], {
            type: 'application/pdf',
          });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `${fileName}.pdf`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        } else {
          snackBar({
            message: `Misslyckades med att hämta filen "${fileName}"`,
            status: 'error',
          });
        }
      })
      .finally(() => setLoadingAttachmentIndex(-1));
  };

  return (
    <DefaultLayout
      title={`Postportalen`}
      pageheader={
        <PageHeader color="transparent">
          <Breadcrumb>
            <Breadcrumb.Item>
              <Breadcrumb.Link href="/my-statistics">{t('common:mainMenu.myStatistics')}</Breadcrumb.Link>
            </Breadcrumb.Item>

            <Breadcrumb.Item currentPage>
              <Breadcrumb.Link>{t('statistics:myStatistics.recLetterSubject', { subject: subject })}</Breadcrumb.Link>
            </Breadcrumb.Item>
          </Breadcrumb>
        </PageHeader>
      }
    >
      {loaded ? (
        <div className="w-full mx-auto p-32 bg-background-content shadow-50 rounded-14">
          <h1 className="text-h4-lg mb-8">{t('statistics:myStatistics.recLetterSubject', { subject: subject })}</h1>
          <p className="mb-40">{sent ? dayjs(sent).format('YYYY-MM-DD, HH:mm') : ''}</p>

          <h3 className="mt-40 pb-4 text-label-medium">{capitalize(t('statistics:myStatistics.recipient'))}</h3>
          {recipientList?.length > 0 && (
            <AutoTable
              className="mt-16"
              footer={recipientList.length >= 12}
              pageSize={11}
              autodata={[...recipientList]}
              autoheaders={headers}
            />
          )}

          <p className="mt-40 font-bold">{capitalize(t('statistics:myStatistics.attachments'))}</p>
          {attachments?.length ? (
            <>
              <div className="flex flex-col items-start mt-16">
                {attachments?.map((file, index) => (
                  <div className="w-full" key={`${file.fileName}-${index}`}>
                    <div className="flex items-center p-12 gap-12 w-full">
                      <div className="bg-vattjom-surface-accent rounded-8 flex p-6">
                        <Icon className="text-vattjom-text-primary" icon={<File />} />
                      </div>
                      <span className="flex-1 text-secondary text-base font-bold">{file.fileName}</span>
                      <Button
                        loading={loadingAttachmentIndex === index}
                        onClick={() => getAttachment(file.fileName, index)}
                        variant="tertiary"
                        aria-label={capitalize(t('statistics:myStatistics.attachments'))}
                      >
                        {t('statistics:myStatistics.showAttachment')} <Icon icon={<Download />} />
                      </Button>
                    </div>
                    <Divider className="m-0" />
                  </div>
                ))}
              </div>
            </>
          ) : null}
        </div>
      ) : (
        <Spinner />
      )}
    </DefaultLayout>
  );
};

export const getServerSideProps = async ({ locale }: { locale: string }) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common', 'statistics'])),
  },
});

export default MyStatisticsDetails;
