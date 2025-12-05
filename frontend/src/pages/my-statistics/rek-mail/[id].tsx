import DefaultLayout from '@layouts/default-layout/default-layout.component';
import { PageHeader } from '@layouts/page-header/page-header.component';
import { useRouter } from 'next/router';
import { useMemo, useState } from 'react';
import {
  Icon,
  Breadcrumb,
  AutoTable,
  AutoTableHeader,
  Button,
  Spinner,
  useSnackbar,
  Divider,
  Label,
} from '@sk-web-gui/react';
import { File, Download } from 'lucide-react';
import { useMessage, getAttachmentFile, useGetSigningInfo, useDownloadReceipt } from '@services/my-statistics-service';
import dayjs from 'dayjs';
import { EnumLetterState, RecAttachment } from '@interfaces/statistics.interface';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'react-i18next';
import { capitalize } from '@mui/material';
import HeaderMenu from '@components/header-menu/header-menu.component';
import { formatPersonNumber } from '@utils/helpers';
import { useRecipientName } from '@services/recipient-service';
import { EnumColors } from '@interfaces/common';
import CustomAlert from '@components/custom-alert/custom-alert-component';

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
      renderColumn: (status: EnumLetterState) => {
        const valueMap: Record<EnumLetterState, string> = {
          [EnumLetterState.NEW]: t('statistics:myStatistics.signingInfo.new'),
          [EnumLetterState.SENT]: t('statistics:myStatistics.signingInfo.sent'),
          [EnumLetterState.PENDING]: t('statistics:myStatistics.signingInfo.pending'),
          [EnumLetterState.FAILED]: t('statistics:myStatistics.signingInfo.failed'),
          [EnumLetterState.FAILED_Server_Error]: t('statistics:myStatistics.signingInfo.failed'),
          [EnumLetterState.FAILED_Client_Error]: t('statistics:myStatistics.signingInfo.failed'),
          [EnumLetterState.FAILED_Unknown_Error]: t('statistics:myStatistics.signingInfo.failed'),
          [EnumLetterState.SIGNED]: t('statistics:myStatistics.signingInfo.signed'),
          [EnumLetterState.EXPIRED]: t('statistics:myStatistics.signingInfo.expired'),
        };
        const colorMap: Record<EnumLetterState, string> = {
          [EnumLetterState.NEW]: EnumColors.TERTIARY,
          [EnumLetterState.SENT]: EnumColors.VATTJOM,
          [EnumLetterState.PENDING]: EnumColors.WARNING,
          [EnumLetterState.FAILED]: EnumColors.ERROR,
          [EnumLetterState.FAILED_Server_Error]: EnumColors.ERROR,
          [EnumLetterState.FAILED_Client_Error]: EnumColors.ERROR,
          [EnumLetterState.FAILED_Unknown_Error]: EnumColors.ERROR,
          [EnumLetterState.SIGNED]: EnumColors.GRONSTA,
          [EnumLetterState.EXPIRED]: EnumColors.TERTIARY,
        };

        const displayValue = valueMap[status] ?? '';
        const displayColor = colorMap[status] ?? EnumColors.TERTIARY;

        return (
          <Label color={displayColor} inverted rounded>
            {displayValue}
          </Label>
        );
      },
    },
    {
      label: '',
      columnPosition: 'right',
      renderColumn: (_value, item) => {
        if (item?.status !== EnumLetterState.SIGNED || !signingInfoData) {
          return <></>;
        }
        return (
          <Button
            size="sm"
            color="vattjom"
            rightIcon={isLoadingReceipt ? <Spinner color="info" /> : <Download />}
            onClick={handleDownloadReceipt}
          >
            {t(`statistics:myStatistics.${isLoadingReceipt ? 'downloading' : 'downloadReceipt'}`)}
          </Button>
        );
      },
    },
  ];

  const recipient = useMemo(() => {
    return message?.recipients?.[0];
  }, [message]);

  const recipientName = useRecipientName(recipient);

  const recipientInfo = useMemo(() => {
    const status = message?.signingStatus?.letterState;

    if (!recipient) {
      return {
        recipient: t('statistics:myStatistics.unknown'),
        status,
      };
    }

    const personnummer = formatPersonNumber(recipient.personnummer ?? '');
    const name = recipientName;

    return {
      recipient: [name, personnummer].filter(Boolean).join(', '),
      status,
    };
  }, [recipient, recipientName, message, t]);

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

  const renderAttachments = () => {
    if (!recAttachments?.length) return null;

    return (
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
    );
  };

  return (
    <DefaultLayout
      title={`Postportalen`}
      headerMenu={<HeaderMenu />}
      pageheader={<PageHeader color="transparent">{breadCrumb}</PageHeader>}
    >
      {messageLoaded ? (
        <div
          data-cy="send-type-item"
          className="flex flex-col w-full mx-auto p-32 bg-background-content shadow-50 rounded-14 gap-56"
        >
          <div>
            <h1 className="text-h4-lg mb-8">
              {t('statistics:myStatistics.recLetterSubject', { subject: message.subject })}
            </h1>
            <p className="">{message.sentAt ? dayjs(message.sentAt).format('YYYY-MM-DD, HH.mm') : ''}</p>
          </div>

          <div>
            <h3 className="pb-4 text-label-medium">{capitalize(t('statistics:myStatistics.recipient'))}</h3>
            <p className="text-dark-secondary font-normal">{t('statistics:myStatistics.recipientDescription')}</p>
            <AutoTable
              className="mt-16"
              pageSize={11}
              autodata={[recipientInfo]}
              autoheaders={headers}
              footer={false}
              tableSortable={false}
              data-cy="letter-recepient-table"
            />
          </div>

          {recipientInfo.status === EnumLetterState.FAILED && (
            <CustomAlert title={t('statistics:myStatistics.errors.messagesSendingFailed')} />
          )}

          <div>
            <p className="font-bold">{capitalize(t('statistics:myStatistics.attachments'))}</p>
            {renderAttachments()}
          </div>
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
