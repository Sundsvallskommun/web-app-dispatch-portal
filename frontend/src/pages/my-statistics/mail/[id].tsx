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
import {
  createEmptyUserMessage,
  EnumMessageStatus,
  MessageAttachment,
  UserMessage,
} from '@interfaces/statistics.interface';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'react-i18next';
import { isDigitalMessage } from '@utils/statistics-helpers';
import HeaderMenu from '@components/header-menu/header-menu.component';
import { formatPersonNumber } from '@utils/helpers';
import CustomAlert from '@components/custom-alert/custom-alert-component';
import { capitalize } from 'underscore.string';

const defaultMessageInfo: UserMessage = createEmptyUserMessage();

const MyStatisticsDetails = () => {
  const router = useRouter();
  const id = Array.isArray(router.query.id) ? router.query.id[0] : router.query.id;
  const snackBar = useSnackbar();
  const { t } = useTranslation();

  const [loadingAttachmentIndex, setLoadingAttachmentIndex] = useState<number>(-1);
  const { message, loaded } = useMessage(id ?? '');
  const { recipients, attachments, sentAt, subject } = message ?? defaultMessageInfo;

  const headers: Array<AutoTableHeader | string> = [
    {
      label: capitalize(t('statistics:myStatistics.recipient')),
      property: 'recipient',
      isColumnSortable: false,
    },
    {
      label: t('statistics:myStatistics.address'),
      property: 'address',
      isColumnSortable: false,
    },
    {
      label: t('statistics:myStatistics.deliveryMethod'),
      property: 'messageType',
      renderColumn: (_value, item) => (
        <div className="min-w-[120px]">
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
    {
      label: '',
      columnPosition: 'right',
      isColumnSortable: false,
      renderColumn(_value, item) {
        if (item?.status === EnumMessageStatus.FAILED) {
          return (
            <Label rounded inverted color="error">
              {t('statistics:myStatistics.signingInfo.failed')}
            </Label>
          );
        }
        return <></>;
      },
    },
  ];

  const recipientList = recipients?.map((r) => {
    return {
      recipient: (
        <>
          {r?.name ?? ''}
          {r?.personnummer && (
            <>
              <br />
              {formatPersonNumber(r.personnummer.toString())}
            </>
          )}
        </>
      ),
      address: (
        <>
          {r?.streetAddress ?? ''}
          {r?.streetAddress && (
            <>
              <span>,</span>
              <br />
            </>
          )}
          {r?.zipCode ?? ''} {r?.city ?? ''}
        </>
      ),
      messageType: r.messageType,
      status: r.status,
    };
  });

  const recipientsSnailMail = recipientList?.filter((r) => !isDigitalMessage(r.messageType));
  const recipientsDigitalMail = recipientList?.filter((r) => isDigitalMessage(r.messageType));

  const getAttachment = (file: MessageAttachment, index: number) => {
    setLoadingAttachmentIndex(index);

    getAttachmentFile(file.attachmentId)
      .then((d) => {
        if (typeof d.error === 'undefined') {
          const bufferArray = new Uint8Array(d.data).buffer;
          const blob = new Blob([bufferArray], {
            type: 'application/pdf',
          });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `${file.fileName}`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
        } else {
          snackBar({
            message: t('statistics:myStatistics.failedFetchingFile', { fileName: file.fileName }),
            status: 'error',
          });
        }
      })
      .finally(() => setLoadingAttachmentIndex(-1));
  };

  return (
    <DefaultLayout
      title={`Postportalen`}
      headerMenu={<HeaderMenu />}
      pageheader={
        <PageHeader color="transparent">
          <Breadcrumb>
            <Breadcrumb.Item>
              <Breadcrumb.Link href="/my-statistics">{t('common:mainMenu.myStatistics')}</Breadcrumb.Link>
            </Breadcrumb.Item>

            <Breadcrumb.Item currentPage>
              <Breadcrumb.Link>{t('statistics:myStatistics.letterSubject', { subject: subject })}</Breadcrumb.Link>
            </Breadcrumb.Item>
          </Breadcrumb>
        </PageHeader>
      }
    >
      {loaded ? (
        <div
          data-cy="send-type-item"
          className="flex flex-col items-start w-full mx-auto p-32 bg-background-content shadow-50 rounded-14 gap-56"
        >
          <div>
            <h1 className="text-h4-lg mb-8">{t('statistics:myStatistics.letterSubject', { subject: subject })}</h1>
            <p>{sentAt ? dayjs(sentAt).format('YYYY-MM-DD, HH.mm') : ''}</p>
          </div>

          {recipientList?.some((r) => r.status === EnumMessageStatus.FAILED) && (
            <CustomAlert title={t('statistics:myStatistics.errors.someMessagesNotSent')} />
          )}

          <div className="flex flex-col items-start gap-16 self-stretch">
            <h3 className="pb-4 text-label-medium">{capitalize(t('statistics:myStatistics.recipient'))}</h3>
            <Tabs>
              <Tabs.Item>
                <Tabs.Button>
                  {t('statistics:myStatistics.all')} ({recipientList?.length ?? '0'})
                </Tabs.Button>
                <Tabs.Content>
                  {recipientList?.length > 0 && (
                    <AutoTable
                      footer={recipientList.length >= 12}
                      pageSize={11}
                      autodata={[...recipientList]}
                      autoheaders={headers}
                    />
                  )}
                </Tabs.Content>
              </Tabs.Item>
              <Tabs.Item>
                <Tabs.Button>
                  {t('statistics:myStatistics.digitalMail')} ({recipientsDigitalMail?.length ?? '0'})
                </Tabs.Button>
                <Tabs.Content>
                  {recipientsDigitalMail?.length > 0 && (
                    <AutoTable
                      footer={recipientsDigitalMail.length >= 12}
                      pageSize={11}
                      autodata={[...recipientsDigitalMail]}
                      autoheaders={headers}
                    />
                  )}
                </Tabs.Content>
              </Tabs.Item>
              <Tabs.Item>
                <Tabs.Button>
                  {t('statistics:myStatistics.snailMail')} ({recipientsSnailMail?.length ?? '0'})
                </Tabs.Button>
                <Tabs.Content>
                  {recipientsSnailMail?.length > 0 && (
                    <AutoTable
                      footer={recipientsSnailMail.length >= 12}
                      pageSize={11}
                      autodata={[...recipientsSnailMail]}
                      autoheaders={headers}
                    />
                  )}
                </Tabs.Content>
              </Tabs.Item>
            </Tabs>
          </div>

          <div className="flex flex-col items-start gap-16 self-stretch">
            <p className="font-bold">{capitalize(t('statistics:myStatistics.attachments'))}</p>
            {attachments?.length ? (
              <div className="flex flex-col items-start content-center gap-4 self-stretch">
                {attachments?.map((file, index) => (
                  <div className="w-full" key={`${file.fileName}-${index}`}>
                    <div className="w-full flex items-center p-12 gap-12 self-stretch">
                      <div className="rounded-8 bg-vattjom-surface-accent flex p-6">
                        <Icon className="text-vattjom-text-primary" icon={<File />} />
                      </div>
                      <span className="flex-1 text-secondary text-base font-bold">{file.fileName}</span>
                      <Button
                        onClick={() => getAttachment(file, index)}
                        loading={loadingAttachmentIndex === index}
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
