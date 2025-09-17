import DefaultLayout from '@layouts/default-layout/default-layout.component';
import { Spinner, AutoTable, AutoTableHeader, Button, Icon, SortMode } from '@sk-web-gui/react';
import { useMyStatistics } from '@services/my-statistics-service';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { Recipient } from '@interfaces/statistics.interface';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

const messageTypeToHumanReadable = (type: string) => {
  switch (type) {
    case 'SMS':
      return 'Sms';
    case 'SNAIL_MAIL':
      return 'Brev';
    case 'DIGITAL_MAIL':
      return 'Brev';
    default:
      return type;
  }
};

const getMessagePrefixUrl = (type: string) => {
  switch (type) {
    case 'SMS':
      return '/my-statistics/sms';
    default:
      return '/my-statistics/mail';
  }
};

const headers: Array<AutoTableHeader | string> = [
  {
    label: 'Datum',
    property: 'sent',
    renderColumn: (value) => new Date(value).toLocaleDateString(),
  },
  {
    label: 'Meddelandetyp',
    property: 'recipients',
    renderColumn: (value) => <strong>{messageTypeToHumanReadable(value[0]?.messageType)}</strong>,
  },
  {
    label: 'Textfiler (antal)',
    property: 'attachments',
    renderColumn: (value) => value.length,
  },
  {
    label: 'Mottagare (antal)',
    property: 'recipients',
    renderColumn: (value) => value?.filter((r: Recipient) => r.status === 'SENT')?.length,
  },
  {
    label: 'Visaknapp',
    screenReaderOnly: true,
    columnPosition: 'right',
    renderColumn: (value, item) => (
      <div className="flex flex-1 justify-end text-right">
        <Link
          href={`${getMessagePrefixUrl(item?.recipients[0]?.messageType)}/${item.messageId}`}
          passHref
          legacyBehavior
        >
          <Button aria-label={`Visa statistik`} variant="tertiary">
            Visa <Icon icon={<ArrowRight />} />
          </Button>
        </Link>
      </div>
    ),
    isColumnSortable: false,
  },
];

export const StatisticsPage = () => {
  const { messages, loaded } = useMyStatistics();

  return (
    <DefaultLayout title={`Postportal`}>
      <div className="text-lg mb-56 pt-32">
        <h1 className="text-h1-lg mb-8">Dina utskick</h1>
        <p className="text-large text-dark-secondary mt-0">
          Här hittar du dina skickade brev. Utskicken sparas i 30 dagar.
        </p>
      </div>

      <div className="max-w-full mb-80">
        {!loaded ? (
          <Spinner />
        ) : (
          <AutoTable
            sortedOrder={SortMode.DESC}
            footer={messages.length >= 12}
            pageSize={11}
            autodata={messages}
            autoheaders={headers}
          />
        )}
      </div>
    </DefaultLayout>
  );
};

export const getServerSideProps: GetServerSideProps<object> = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'sv', ['common', 'send-mail'])),
  },
});

export default StatisticsPage;
