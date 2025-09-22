import DefaultLayout from '@layouts/default-layout/default-layout.component';
import { Spinner } from '@sk-web-gui/react';
import { useMyStatistics } from '@services/my-statistics-service';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { ListItem } from '@components/list-item/list-item.component';
import { useTranslation } from 'react-i18next';

export const StatisticsPage = () => {
  const { batches, loaded } = useMyStatistics();
  const { t } = useTranslation();

  return (
    <DefaultLayout title={`Postportal`}>
      <div className="text-lg mb-56 pt-32">
        <h1 className="text-h1-lg mb-8">{t('common:mainMenu.myStatistics')}</h1>
        <p className="text-large text-dark-secondary mt-0">{t('statistics:myStatistics.description')}</p>
      </div>

      <div className="max-w-full mb-80">
        {!loaded ? (
          <Spinner />
        ) : (
          batches.map((batch) => {
            return <ListItem data={batch} key={batch?.batchId} />;
          })
        )}
      </div>
    </DefaultLayout>
  );
};

export const getServerSideProps: GetServerSideProps<object> = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'sv', ['common', 'statistics'])),
  },
});

export default StatisticsPage;
