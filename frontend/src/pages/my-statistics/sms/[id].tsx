import DefaultLayout from '@layouts/default-layout/default-layout.component';
import { PageHeader } from '@layouts/page-header/page-header.component';
import { useRouter } from 'next/router';
import { Breadcrumb, Spinner, Label } from '@sk-web-gui/react';
import { useMessage } from '@services/my-statistics-service';
import dayjs from 'dayjs';
import { createEmptyUserMessage, UserMessage } from '@interfaces/statistics.interface';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'react-i18next';
import HeaderMenu from '@components/header-menu/header-menu.component';
import { formatMobileNumberDisplay } from '@utils/phone-number.helpers';
import { capitalize } from 'underscore.string';

const defaultMessageInfo: UserMessage = createEmptyUserMessage();

const MyStatisticsDetails = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const id = Array.isArray(router.query.id) ? router.query.id[0] : router.query.id;

  const { message, loaded } = useMessage(id ?? '');
  const { recipients, sentAt } = message ?? defaultMessageInfo;

  return (
    <DefaultLayout
      title={t('common:appTitle')}
      headerMenu={<HeaderMenu />}
      pageheader={
        <PageHeader color="transparent">
          <Breadcrumb>
            <Breadcrumb.Item>
              <Breadcrumb.Link href="/my-statistics">{t('common:mainMenu.myStatistics')}</Breadcrumb.Link>
            </Breadcrumb.Item>

            <Breadcrumb.Item currentPage>
              <Breadcrumb.Link>{t('statistics:myStatistics.sms')}</Breadcrumb.Link>
            </Breadcrumb.Item>
          </Breadcrumb>
        </PageHeader>
      }
    >
      {loaded ? (
        <div data-cy="send-type-item" className="w-full mx-auto p-32 bg-background-content shadow-50 rounded-14">
          <h1 className="text-h4-lg mb-8">{t('statistics:myStatistics.sms')}</h1>
          <p className="mb-40">{sentAt ? dayjs(sentAt).format('YYYY-MM-DD, HH.mm') : ''}</p>

          <h3 className="pb-16 text-label-medium">
            {capitalize(t('statistics:myStatistics.recipient'))} ({recipients.length})
          </h3>
          <div className="flex flex-col items-start gap-6 mb-40">
            {recipients?.map((recipient, index) => (
              <div className="flex flex-row items-center" key={`${index}-${recipient?.mobileNumber}`}>
                <div className="py-6 px-12 border-1 border-divider rounded-button">
                  {formatMobileNumberDisplay(recipient?.mobileNumber ?? '') ??
                    t('statistics:myStatistics.unknownNumber')}
                </div>
                <Label className="ml-8">{t(`statistics:myStatistics.status.${recipient?.status ?? 'default'}`)}</Label>
              </div>
            ))}
          </div>

          <h3 className="pb-4 text-label-medium">{t('statistics:myStatistics.message')}</h3>
          <div className="border-1 border-divider p-20 rounded-button">{message?.body}</div>
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
