import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import DefaultLayout from '@layouts/default-layout/default-layout.component';
import { useUserStore } from '@services/user-service/user-service';
import { useTranslation } from 'next-i18next';
import { Mail, MailCheck, Smartphone } from 'lucide-react';
import MainCard from '@components/main-card/main-card';

const Index = () => {
  const [isCheckingPermissions, setIsCheckingPermissions] = useState(true);
  const user = useUserStore((state) => state.user);
  const router = useRouter();
  const { t } = useTranslation(['common']);

  useEffect(() => {
    setIsCheckingPermissions(false);
  }, [user.permissions.canSendSMS, router]);

  return (
    <DefaultLayout title={t('appTitle')}>
      {!isCheckingPermissions && (
        <>
          <h1 className="sr-only">{`${t('screenReader.sendPost')}.`}</h1>
          <div className="flex self-center flex-col text-lg mb-11 max-w-max mt-[128px] gap-56">
            <div className="text-center flex flex-col gap-16">
              <p className="text-base">{t('indexSubtitle')}</p>
              <h1 className="text-display-3-lg mb-0">{`${t('indexSubHeader')}`}</h1>
            </div>
            <div className="flex items-start self-stretch md:flex flex-1 basis-0 gap-32">
              <NextLink href={'/send/mail'} passHref className="flex-1">
                <MainCard
                  icon={<Mail />}
                  title="Brev"
                  contentText="Skicka brev digitalt, eller som vanlig post om mottagaren saknar digital brevlåda."
                  subContentText="Pris: 0,5 kr/mottagare"
                />
              </NextLink>
              <NextLink href={''} passHref className="flex-1">
                <MainCard
                  icon={<MailCheck />}
                  title="Rekomenderat brev"
                  contentText="Skicka viktiga dokument tryggt via Kivra när en kvittens från mottagaren behövs."
                  subContentText="Pris: 20 kr/mottagare"
                />
              </NextLink>
              {user.permissions.canSendSMS && (
                <NextLink href="/send/sms" legacyBehavior passHref>
                  <MainCard
                    icon={<Smartphone />}
                    title={t('textMessage')}
                    contentText="Ett snabbt sätt att nå mottagaren när viktig information behöver delas."
                    subContentText="Pris: 0,5 kr/mottagare"
                  />
                </NextLink>
              )}
            </div>
          </div>
        </>
      )}
    </DefaultLayout>
  );
};

export const getStaticProps: GetServerSideProps<{}> = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'sv', ['common'])),
  },
});

export default Index;
