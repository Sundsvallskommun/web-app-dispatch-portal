import DefaultLayout from '@layouts/default-layout/default-layout.component';
import { PageHeader } from '@layouts/page-header/page-header.component';
import { useRouter } from 'next/router';
import { useEffect, useMemo, useState } from 'react';
import { Icon, Breadcrumb, AutoTable, AutoTableHeader, Button, Spinner, useSnackbar, Divider } from '@sk-web-gui/react';
import { File, Download } from 'lucide-react';
import { useMessage, getAttachmentFile } from '@services/my-statistics-service';
import dayjs from 'dayjs';
import { RecAttachment } from '@interfaces/statistics.interface';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'react-i18next';
import { capitalize } from '@mui/material';
import HeaderMenu from '@components/header-menu/header-menu.component';
import { getCitizen } from '@services/recipient-service';
import { formatPersonNumber } from '@utils/helpers';

const MyStatisticsDetails = () => {
  const router = useRouter();
  const id = Array.isArray(router.query.id) ? router.query.id[0] : router.query.id;
  const snackBar = useSnackbar();
  const { t } = useTranslation(['common', 'statistics']);

  const [loadingAttachmentIndex, setLoadingAttachmentIndex] = useState<number>(-1);

  const { message, loaded: messageLoaded } = useMessage(id ?? '');
  const [recipientName, setRecipientName] = useState('');

  const headers: Array<AutoTableHeader | string> = [
    {
      label: 'Mottagare',
      property: 'recipient',
    },
    {
      label: 'Status',
      property: 'status',
      renderColumn: (value) => {
        const map: Record<string, string> = {
          completed: t('statistics:myStatistics.signingInfo.completed'),
          pending: t('statistics:myStatistics.signingInfo.pending'),
          failed: t('statistics:myStatistics.signingInfo.failed'),
        };

        const key = (value as string)?.toLowerCase();
        const displayValue = map[key] ?? '';

        return (
          <div className="flex items-center bg-gronsta-surface-accent text-gronsta-text-primary py-4 px-10 rounded-circular font-bold">
            {displayValue}{' '}
          </div>
        );
      },
    },
    {
      label: '',
      columnPosition: 'right',
      renderColumn: () => (
        <div className="">
          <Button size="sm" color="vattjom" rightIcon={<Download />}>
            {t('statistics:myStatistics.downloadRecept')}
          </Button>
        </div>
      ),
    },
  ];

  const recipient = useMemo(() => {
    return message?.recipients?.[0];
  }, [message]);

  useEffect(() => {
    const personId = recipient?.partyId;
    if (personId) {
      getCitizen(personId).then((citizen) => {
        if (citizen) {
          setRecipientName([citizen?.givenname, citizen?.lastname].join(' '));
        }
      });
    }
  }, [recipient]);

  // Define the data of the table
  let recipientInfo = undefined;
  if (recipient) {
    const recipientPersonnummer = formatPersonNumber(recipient.personnummer?.toString() ?? '') ?? '';

    recipientInfo = {
      recipient:
        recipientName && recipientPersonnummer
          ? `${recipientName}, ${recipientPersonnummer}`
          : recipientName || recipientPersonnummer,
      status: recipient.status,
    };
  } else {
    recipientInfo = {
      recipient: 'Okänd',
      status: message.signingStatus?.letterState,
    };
  }

  const recAttachments = useMemo<RecAttachment[]>(() => {
    if (message) {
      const attachments = message.attachments.map((a) => {
        return { contentType: a.contentType, fileName: a.fileName, id: a.attachmentId } as RecAttachment;
      });

      return attachments;
    } else return [];
  }, [message]);

  const getRecAttachment = (fileName: string, attachmentId: string, index: number) => {
    setLoadingAttachmentIndex(index);

    if (!id) return;

    getAttachmentFile(attachmentId)
      .then((d) => {
        if (d.error === undefined) {
          const bufferArray = new Uint8Array(d.data).buffer;
          const blob = new Blob([bufferArray], {
            type: 'application/pdf',
          });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `${fileName}`;
          document.body.appendChild(a);
          a.click();
          a.remove();
          URL.revokeObjectURL(url);
        } else {
          snackBar({
            message: t('statistics:myStatistics.errors.FailedGettingFile', { subject: fileName }),
            status: 'error',
          });
        }
      })
      .finally(() => setLoadingAttachmentIndex(-1));
  };

  const breadCrumb = (
    <Breadcrumb>
      <Breadcrumb.Item>
        <Breadcrumb.Link href="/my-statistics">{t('common:mainMenu.myStatistics')}</Breadcrumb.Link>
      </Breadcrumb.Item>

      <Breadcrumb.Item currentPage>
        <Breadcrumb.Link>{t('statistics:myStatistics.recLetterSubject', { subject: message.subject })}</Breadcrumb.Link>
      </Breadcrumb.Item>
    </Breadcrumb>
  );

  return (
    <DefaultLayout
      title={`Postportalen`}
      headerMenu={<HeaderMenu />}
      pageheader={<PageHeader color="transparent">{breadCrumb}</PageHeader>}
    >
      {messageLoaded ? (
        <div data-cy="send-type-item" className="w-full mx-auto p-32 bg-background-content shadow-50 rounded-14">
          <h1 className="text-h4-lg mb-8">
            {t('statistics:myStatistics.recLetterSubject', { subject: message.subject })}
          </h1>
          <p className="mb-40">{message.sentAt ? dayjs(message.sentAt).format('YYYY-MM-DD, HH:mm') : ''}</p>

          <h3 className="mt-40 pb-4 text-label-medium">{capitalize(t('statistics:myStatistics.recipient'))}</h3>
          <AutoTable
            className="mt-16"
            pageSize={11}
            autodata={[recipientInfo]}
            autoheaders={headers}
            footer={false}
            tableSortable={false}
          />

          <p className="mt-40 font-bold">{capitalize(t('statistics:myStatistics.attachments'))}</p>
          {recAttachments?.length ? (
            <div className="flex flex-col items-start mt-16">
              {recAttachments?.map((file, index) => (
                <div className="w-full" key={`${file.fileName}-${index}`}>
                  <div className="flex items-center p-12 gap-12 w-full">
                    <div className="bg-vattjom-surface-accent rounded-8 flex p-6">
                      <Icon className="text-vattjom-text-primary" icon={<File />} />
                    </div>
                    <span className="flex-1 text-secondary text-base font-bold">{file.fileName}</span>
                    <Button
                      loading={loadingAttachmentIndex === index}
                      onClick={() => getRecAttachment(file.fileName, file.id, index)}
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
