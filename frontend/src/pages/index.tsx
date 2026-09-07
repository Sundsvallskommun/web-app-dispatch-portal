import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import DefaultLayout from '@layouts/default-layout/default-layout.component';
import { useUserStore } from '@services/user-service/user-service';
import { useTranslation } from 'next-i18next';
import { Mail, MailCheck, Smartphone, Pencil } from 'lucide-react';
import MainCard from '@components/main-card/main-card.component';
import { Link } from '@sk-web-gui/react';
import HeaderMenu from '@components/header-menu/header-menu.component';

const Index = () => {
  const user = useUserStore((state) => state.user);
  const { canSendLetter, canSendRegisteredLetter, canSendSMS } = user?.permissions ?? {};
  const { t } = useTranslation(['common', 'start-page']);

  const isCheckingPermissions = !user?.name;

  return (
    <DefaultLayout title={t('start-page:appTitle')} headerMenu={<HeaderMenu />}>
      {!isCheckingPermissions && (
        <div className="pt-[12.8rem] flex flex-col items-center gap-32 flex-1 self-stretch">
          <div className="flex self-center items-center flex-col text-lg mb-11 max-w-max gap-56">
            <div className="text-center flex flex-col gap-16 lining-nums proportional-nums">
              <h1 className="text-large text-dark-secondary font-sans font-normal m-0">{t('start-page:subtitle')}</h1>
              <p className="header-font text-display-3-lg text-dark-primary ">{`${t('start-page:header')}`}</p>
            </div>
            <div className="grid grid-flow-row self-stretch gap-32 lg:grid-cols-2">
              {canSendLetter && (
                <Link href={'/send/mail'} className="start-link w-full">
                  <MainCard
                    icon={<Mail />}
                    title={t('start-page:letter')}
                    contentText={t('start-page:sendLetterDigitally')}
                  />
                </Link>
              )}
              {canSendRegisteredLetter && (
                <Link href={'/send/rek-mail'} className="start-link w-full">
                  <MainCard
                    icon={<MailCheck />}
                    title={t('start-page:recLetter')}
                    contentText={t('start-page:sendImportantDoc')}
                  />
                </Link>
              )}
              {canSendSMS && (
                <Link href="/send/sms" className="start-link w-full">
                  <MainCard
                    icon={<Smartphone />}
                    title={t('start-page:sms')}
                    contentText={t('start-page:fastMethodToShare')}
                  />
                </Link>
              )}
              {/* Add canSendEsigning permission check when it's available */}
              <Link href="/send/esigning" className="start-link w-full">
                <MainCard
                  icon={<Pencil />}
                  title={t('start-page:eSigning')}
                  contentText={t('start-page:eSigningDescription')}
                />
              </Link>
            </div>
          </div>
        </div>
      )}
    </DefaultLayout>
  );
};

export const getServerSideProps: GetServerSideProps<object> = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'sv', ['common', 'start-page'])),
  },
});

export default Index;
