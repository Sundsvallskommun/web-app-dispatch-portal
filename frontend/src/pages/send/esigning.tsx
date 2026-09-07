import DefaultLayout from '@layouts/default-layout/default-layout.component';
import FormStepperHeader from '@components/form-stepper/form-stepper-header.component';
import { Pencil } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';

export default function SendEsigningPage() {
  const { t } = useTranslation(['common', 'send-esigning']);
  return (
    <DefaultLayout
      title={`Postportalen`}
      headerMenu={<FormStepperHeader title={t('send-esigning:eSigning')} icon={<Pencil />} />}
    >
      <div></div>
    </DefaultLayout>
  );
}

export const getServerSideProps: GetServerSideProps<object> = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'sv', ['common', 'send-esigning', 'help-menu'])),
  },
});
