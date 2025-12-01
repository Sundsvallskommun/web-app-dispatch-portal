import DefaultLayout from '@layouts/default-layout/default-layout.component';
import { PageHeader } from '@layouts/page-header/page-header.component';
import { useRouter } from 'next/router';
import { useMemo, useState } from 'react';
import { Icon, Breadcrumb, AutoTable, AutoTableHeader, Button, Spinner, useSnackbar, Divider } from '@sk-web-gui/react';
import { File, Download } from 'lucide-react';
import { useMessage, getAttachmentFile, useGetSigningInfo, useDownloadReceipt } from '@services/my-statistics-service';
import dayjs from 'dayjs';
import { EnumMessageStatus, EnumSigningState, RecAttachment } from '@interfaces/statistics.interface';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'react-i18next';
import { capitalize } from '@mui/material';
import HeaderMenu from '@components/header-menu/header-menu.component';
import { formatPersonNumber } from '@utils/helpers';
import { useRecipientName } from '@services/recipient-service';

const MyStatisticsDetails = () => {
  const router = useRouter();
  const id = Array.isArray(router.query.id) ? router.query.id[0] : router.query.id;
  const snackBar = useSnackbar();
  const { t } = useTranslation(['common', 'statistics']);
  const [loadingAttachmentIndex, setLoadingAttachmentIndex] = useState<number>(-1);
  const { message, loaded: messageLoaded } = useMessage(id ?? '');
  const { data: signingInfoData } = useGetSigningInfo(id ?? '');
  const { download, isLoading: isLoadingReceipt } = useDownloadReceipt(signingInfoData);

  const handleDownloadReceipt = async () => {
    const downloading = await download(id ?? '');
    snackBar({
      message: t(`statistics:myStatistics.receiptStatus.${downloading.success ? 'success' : 'error'}`, {
        receipt: downloading.fileName,
      }),
      status: downloading.success ? 'success' : 'error',
    });
  };

  const headers: Array<AutoTableHeader | string> = [
    {
      label: capitalize(t('statistics:myStatistics.recipient')),
      property: 'recipient',
    },
    {
      label: 'Status',
      property: 'status',
      renderColumn: (status: string) => {
        const map: Record<string, string> = {
          signed: t('statistics:myStatistics.signingInfo.completed'),
          pending: t('statistics:myStatistics.signingInfo.pending'),
          failed: t('statistics:myStatistics.signingInfo.failed'),
          sent: t('statistics:myStatistics.signingInfo.sent'),
        };

        const key = status?.toLowerCase();
        const displayValue = map[key] ?? '';

        return (
          <div className="flex items-center bg-gronsta-surface-accent text-gronsta-text-primary py-4 px-10 rounded-circular font-bold">
            {displayValue}
          </div>
        );
      },
    },
    signingInfoData
      ? {
          label: '',
          columnPosition: 'right',
          renderColumn: () => (
            <div className="">
              <Button
                size="sm"
                color="vattjom"
                rightIcon={isLoadingReceipt ? <Spinner color="info" /> : <Download />}
                onClick={handleDownloadReceipt}
              >
                {t(`statistics:myStatistics.${isLoadingReceipt ? 'downloading' : 'downloadReceipt'}`)}
              </Button>
            </div>
          ),
        }
      : {},
  ];

  const recipient = useMemo(() => {
    return message?.recipients?.[0];
  }, [message]);

  const recipientName = useRecipientName(recipient);

  const recipientInfo: { recipient: string; status: EnumMessageStatus | EnumSigningState | undefined } = useMemo(() => {
    if (!recipient) {
      return {
        recipient: t('statistics:myStatistics.unknown'),
        status: message.signingStatus?.signingProcessState,
      };
    }

    const personnummer = formatPersonNumber(recipient.personnummer ?? '');
    const name = recipientName;

    return {
      recipient: [name, personnummer].filter(Boolean).join(', '),
      status: recipient.status,
    };
  }, [recipient, recipientName, message]);

  const recAttachments = useMemo<RecAttachment[]>(() => {
    if (message) {
      const attachments = message.attachments.map((a) => {
        return { contentType: a.contentType, fileName: a.fileName, id: a.attachmentId } as RecAttachment;
      });

      return attachments;
    } else return [];
  }, [message]);

  const getRecAttachment = async (fileName: string, attachmentId: string, index: number) => {
    setLoadingAttachmentIndex(index);

    if (!id) return;

    try {
      const attachmentFile = await getAttachmentFile(attachmentId);

      if (attachmentFile.error) {
        snackBar({
          message: t('statistics:myStatistics.errors.FailedGettingFile', { subject: fileName }),
          status: 'error',
        });
      }

      const blob = new Blob([new Uint8Array(attachmentFile.data!)], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = `${fileName}`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } finally {
      setLoadingAttachmentIndex(-1);
    }
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
            data-cy="letter-recepient-table"
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
