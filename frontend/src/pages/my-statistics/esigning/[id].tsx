import DefaultLayout from '@layouts/default-layout/default-layout.component';
import { PageHeader } from '@layouts/page-header/page-header.component';
import { useRouter } from 'next/router';
import { useState } from 'react';
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
import { File, Download, Pencil } from 'lucide-react';
import { getAttachmentFile, useMessage } from '@services/my-statistics-service';
import dayjs from 'dayjs';
import { EnumEsigningProcessState, EnumEsigningStatus, MessageAttachment } from '@interfaces/statistics.interface';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'react-i18next';
import HeaderMenu from '@components/header-menu/header-menu.component';
import { formatLegalId } from '@utils/helpers';
import { capitalize } from 'underscore.string';
import { EsigningStatusLabel } from '@components/esigning-status-label/esigning-status-label.component';
import CustomAlert from '@components/custom-alert/custom-alert-component';

const SIGNED_DOCUMENT = 'signed-document';

const MyStatisticsDetails = () => {
  const router = useRouter();
  const id = Array.isArray(router.query.id) ? router.query.id[0] : router.query.id;
  const snackBar = useSnackbar();
  const { t } = useTranslation(['common', 'statistics']);

  const [loadingFile, setLoadingFile] = useState<string | null>(null);
  const { message, loaded } = useMessage(id ?? '');
  const { recipients, attachments, sentAt, subject, signingStatus } = message;
  const signingDocument = attachments[0];
  const caseState = signingStatus?.signingProcessState;

  const isSigned = caseState === EnumEsigningProcessState.SIGNED;
  const isDeclined = caseState === EnumEsigningProcessState.DECLINED;

  const getSignatoryStatus = (status: string): string => {
    const endsPendingSignatories =
      caseState === EnumEsigningProcessState.EXPIRED ||
      caseState === EnumEsigningProcessState.HALTED ||
      caseState === EnumEsigningProcessState.FAILED;

    return status === EnumEsigningStatus.PENDING && endsPendingSignatories ? caseState : status;
  };

  const headers: Array<AutoTableHeader | string> = [
    {
      label: capitalize(t('statistics:myStatistics.recipient')),
      property: 'recipient',
      isColumnSortable: false,
    },
    {
      label: t('statistics:myStatistics.email'),
      property: 'email',
      isColumnSortable: false,
    },
    {
      label: 'Status',
      property: 'status',
      columnPosition: 'right',
      isColumnSortable: true,
      renderColumn: (status: string) => <EsigningStatusLabel status={status} />,
    },
  ];

  const signatoryList = recipients?.map((r) => ({
    recipient: (
      <>
        {r?.name ?? '-'}
        {r?.legalId && (
          <>
            <br />
            {formatLegalId(r.legalId.toString())}
          </>
        )}
      </>
    ),
    email: r?.email ?? '-',
    status: getSignatoryStatus(r.status),
  }));

  const getAttachment = async (file: MessageAttachment, signed = false) => {
    if (!id) return;

    setLoadingFile(signed ? SIGNED_DOCUMENT : file.attachmentId);

    try {
      const attachmentFile = await getAttachmentFile(id, signed ? undefined : file.attachmentId);

      if (attachmentFile.error !== undefined) {
        snackBar({
          message: t('statistics:myStatistics.failedFetchingFile', { fileName: file.fileName }),
          status: 'error',
        });
        return;
      }

      const contentType = signed ? 'application/pdf' : file.contentType || 'application/pdf';
      const fileName = signed ? `${file.fileName.replace(/\.[^.]+$/, '')}-signerat.pdf` : file.fileName;

      const blob = new Blob([new Uint8Array(attachmentFile.data)], { type: contentType });
      const url = URL.createObjectURL(blob);

      const link = document.createElement('a');
      link.href = url;
      link.download = fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
    } finally {
      setLoadingFile(null);
    }
  };

  const breadCrumb = (
    <Breadcrumb>
      <Breadcrumb.Item>
        <Breadcrumb.Link href="/my-statistics">{t('common:mainMenu.myStatistics')}</Breadcrumb.Link>
      </Breadcrumb.Item>
      <Breadcrumb.Item currentPage>
        <Breadcrumb.Link>{t('statistics:myStatistics.esigningSubject', { subject: subject })}</Breadcrumb.Link>
      </Breadcrumb.Item>
    </Breadcrumb>
  );

  return (
    <DefaultLayout
      title={`Postportalen`}
      headerMenu={<HeaderMenu />}
      pageheader={<PageHeader color="transparent">{breadCrumb}</PageHeader>}
    >
      {loaded ? (
        <div
          data-cy="send-type-item"
          className="flex flex-col w-full mx-auto p-32 bg-background-content shadow-50 rounded-14 gap-56"
        >
          <div>
            <h1 className="text-h4-lg mb-8">{t('statistics:myStatistics.esigningSubject', { subject: subject })}</h1>
            <p>{sentAt ? dayjs(sentAt).format('YYYY-MM-DD, HH.mm') : ''}</p>
          </div>

          {isDeclined && <CustomAlert title={t('statistics:myStatistics.errors.esigningDeclined')} />}

          <div>
            <h3 className="pb-4 text-label-medium">
              {t('statistics:myStatistics.signatories', { count: signatoryList?.length ?? 0 })}
            </h3>
            <p className="text-dark-secondary font-normal">{t('statistics:myStatistics.signatoryDescription')}</p>
            <div className="flex flex-col gap-40">
              {signatoryList?.length > 0 && (
                <AutoTable
                  className="mt-16"
                  data-cy="esigning-signatory-table"
                  autodata={[...signatoryList]}
                  autoheaders={headers}
                  pageSize={signatoryList.length}
                  footer={false}
                  tableSortable={true}
                />
              )}
              {signingDocument && (
                <div className="flex-1 flex-col self-end">
                  <Button
                    disabled={!isSigned}
                    loading={loadingFile === SIGNED_DOCUMENT}
                    onClick={() => getAttachment(signingDocument, true)}
                    color="vattjom"
                    size="sm"
                    aria-label={`${t('statistics:myStatistics.showSignedDocument')} ${signingDocument.fileName}`}
                  >
                    {t('statistics:myStatistics.showSignedDocument')} <Icon icon={<Download />} />
                  </Button>
                </div>
              )}
            </div>
          </div>

          <div>
            <p className="font-bold">{capitalize(t('statistics:myStatistics.attachments'))}</p>
            {attachments?.length ? (
              <div className="flex flex-col items-start mt-16">
                {attachments.map((file, index) => {
                  const isSigningDocument = index === 0;

                  return (
                    <div className="w-full" key={`${file.fileName}-${index}`}>
                      <div className="flex items-center p-12 gap-12 w-full">
                        <div className="bg-vattjom-surface-accent rounded-8 flex p-6">
                          <Icon
                            className="text-vattjom-text-primary"
                            icon={isSigningDocument ? <Pencil /> : <File />}
                          />
                        </div>
                        <span className="flex-1 text-secondary text-base font-bold">{file.fileName}</span>
                        <Button
                          loading={loadingFile === file.attachmentId}
                          onClick={() => getAttachment(file)}
                          size="sm"
                          variant="tertiary"
                          aria-label={`${t('statistics:myStatistics.showAttachment')} ${file.fileName}`}
                        >
                          {t('statistics:myStatistics.showAttachment')} <Icon icon={<Download />} />
                        </Button>
                        <div className="min-w-[88px] flex justify-center">
                          {isSigningDocument ? (
                            <Label color="gronsta" inverted rounded>
                              {t('statistics:myStatistics.signingDocument')}
                            </Label>
                          ) : (
                            <Label color="vattjom" inverted rounded>
                              {t('statistics:myStatistics.attachment')}
                            </Label>
                          )}
                        </div>
                      </div>
                      <Divider className="m-0" />
                    </div>
                  );
                })}
              </div>
            ) : null}
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
