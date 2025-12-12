import { Help } from '@components/help/help.component';
import DefaultLayout from '@layouts/default-layout/default-layout.component';
import { PageHeader } from '@layouts/page-header/page-header.component';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'react-i18next';

export const HelpPage = () => {
  const { t } = useTranslation('help-menu');
  return (
    <DefaultLayout
      title={`Postportalen`}
      pageheader={
        <PageHeader color="vattjom">
          <h1 className="text-h2 m-0">{t('help-menu:pageHeader')}</h1>
          <p className="text-h4-medium md:text-lead leading-lead text-primary font-bold m-0 header-font">
            {t('help-menu:pageDescription')}
          </p>
        </PageHeader>
      }
    >
      <div className="max-w-[80rem] pb-80">
        <Help />
      </div>
    </DefaultLayout>
  );
};

export default HelpPage;

export const getServerSideProps: GetServerSideProps<object> = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'sv', ['help-menu'])),
  },
});
