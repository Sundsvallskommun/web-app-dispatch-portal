import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import DefaultLayout from '@layouts/default-layout/default-layout.component';
import { useUserStore } from '@services/user-service/user-service';
import { Card } from '@sk-web-gui/react';
import { useTranslation } from 'next-i18next';

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
          <div className="flex self-center flex-col text-lg mb-11 pt-48 max-w-max">
            <div className="text-center">
              <p className="text-base mb-16">{t('indexSubtitle')}</p>
              <h1 className="text-display-3-lg mb-40">{`${t('indexSubHeader')}`}</h1>
            </div>
            <div className="md:flex flex-1 basis-0 gap-24">
              <NextLink href="/send/mail" legacyBehavior passHref>
                <Card className="flex-1 mb-32 min-w-[34rem]" color="vattjom" invert={true} useHoverEffect={true}>
                  <Card.Body className="flex-1">
                    <Card.Header>
                      <h2 className="text-h3-md">{t('letter')}</h2>
                    </Card.Header>
                    <Card.Text>
                      {/* <p className="text-small">Någon text som beskriver vad skicka digitalt brev innebär</p> */}
                    </Card.Text>
                  </Card.Body>
                </Card>
              </NextLink>
              {user.permissions.canSendSMS && (
                <NextLink href="/send/sms" legacyBehavior passHref>
                  <Card className="flex-1 mb-32 min-w-[34rem]" color="vattjom" invert={true} useHoverEffect={true}>
                    <Card.Body className="flex-1">
                      <Card.Header>
                        <h2 className="text-h3-md">{t('textMessage')}</h2>
                      </Card.Header>
                      <Card.Text>
                        {/* <p className="text-small">Någon text som beskriver vad skicka sms innebär</p> */}
                      </Card.Text>
                    </Card.Body>
                  </Card>
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
