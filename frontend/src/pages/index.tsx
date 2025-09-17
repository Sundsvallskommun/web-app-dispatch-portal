import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import DefaultLayout from '@layouts/default-layout/default-layout.component';
import { useUserStore } from '@services/user-service/user-service';
import { useTranslation } from 'next-i18next';
import { Mail, MailCheck, Smartphone } from 'lucide-react';
import MainCard from '@components/main-card/main-card.component';

const Index = () => {
  const [isCheckingPermissions, setIsCheckingPermissions] = useState(true);
  const user = useUserStore((state) => state.user);
  const router = useRouter();
  const { t } = useTranslation(['common', 'start-page']);

  useEffect(() => {
    setIsCheckingPermissions(false);
  }, [user.permissions.canSendSMS, router]);

  return (
    <DefaultLayout title={t('start-page:app-title')}>
      {!isCheckingPermissions && (
        <div className="pt-128 flex flex-col items-center gap-32 flex-1 self-stretch">
          <h1 className="sr-only">{`${t('start-page:screen-reader')}.`}</h1>
          <div className="flex self-center items-center flex-col text-lg mb-11 max-w-max gap-56">
            <div className="text-center flex flex-col gap-16 lining-nums proportional-nums">
              <div className="text-large text-dark-secondary">{t('start-page:subtitle')}</div>
              <div className="header-font text-display-3-lg text-dark-primary ">{`${t('start-page:header')}`}</div>
            </div>
            <div className="flex flex-col items-start self-stretch flex-1 basis-0 gap-32 lg:flex-row">
              <NextLink href={'/send/mail'} passHref className="flex-1 w-full">
                <MainCard
                  icon={<Mail />}
                  title={t('start-page:letter')}
                  contentText={t('start-page:send-letter-digitally')}
                  subContentText={t('start-page:price-0.5-kr')}
                />
              </NextLink>
              <NextLink href={''} passHref className="flex-1 w-full">
                <MainCard
                  icon={<MailCheck />}
                  title={t('start-page:rec-letter')}
                  contentText={t('start-page:send-important-doc')}
                  subContentText={t('start-page:price-20-kr')}
                />
              </NextLink>
              {user.permissions.canSendSMS && (
                <NextLink href="/send/sms" passHref className="flex-1 w-full">
                  <MainCard
                    icon={<Smartphone />}
                    title={t('start-page:sms')}
                    contentText={t('start-page:fast-method-to-share')}
                    subContentText={t('start-page:price-0.5-kr')}
                  />
                </NextLink>
              )}
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
