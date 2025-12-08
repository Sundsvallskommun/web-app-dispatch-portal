import DefaultLayout from '@layouts/default-layout/default-layout.component';
import { Spinner } from '@sk-web-gui/react';
import { useMyStatistics } from '@services/my-statistics-service';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { ListItem } from '@components/list-item/list-item.component';
import { useTranslation } from 'react-i18next';
import HeaderMenu from '@components/header-menu/header-menu.component';

export const StatisticsPage = () => {
  const { letterListItems, loaded } = useMyStatistics();
  const { t } = useTranslation();

  return (
    <DefaultLayout title={`Postportal`} headerMenu={<HeaderMenu />}>
      <div className="text-lg mb-56 pt-32">
        <h1 className="text-h1-lg mb-8">{t('common:mainMenu.myStatistics')}</h1>
        <p className="text-large text-dark-secondary mt-0">{t('statistics:myStatistics.description')}</p>
      </div>

      <div data-cy="my-statistics-list" className="max-w-full mb-80">
        {!loaded && <Spinner />}
        {!letterListItems || letterListItems.length === 0 ? (
          <div className="w-full font-normal text-dark-secondary">{t('statistics:myStatistics.noMessagesExist')}</div>
        ) : (
          letterListItems.map((letterListItem) => <ListItem data={letterListItem} key={letterListItem.id} />)
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
