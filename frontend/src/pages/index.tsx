import NextLink from 'next/link';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import DefaultLayout from '@layouts/default-layout/default-layout.component';
import { useUserStore } from '@services/user-service/user-service';
import { Card, Icon } from '@sk-web-gui/react';
import { useTranslation } from 'next-i18next';
import { Mail } from 'lucide-react';

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
              <NextLink href="/send/mail" legacyBehavior passHref className="flex-1">
                <Card className="flex-1 mb-32 min-w-[34rem]" color="vattjom" invert={true} useHoverEffect={true}>
                  <Card.Body className="flex-1 !p-24">
                    <Card.Header className="self-stretch inline-flex justify-center items-center gap-12">
                      <Icon className="!pl-0 h-5 bg-Dark-Secondary text-dark-secondary" size={'28px'} icon={<Mail />} />
                      <div className="justify-center items-center text-[#1F1F25] text-[20px] font-bold font-['Raleway'] leading-7 h-full">
                        {t('letter')}
                      </div>
                    </Card.Header>
                    <Card.Text>
                      <p className="self-stretch justify-center text-[#444450] text-base font-normal font-['Arial'] leading-normal">
                        Skicka brev digitalt, eller som vanlig post om mottagaren saknar digital brevlåda.
                      </p>
                      <p className="self-stretch justify-center text-[#444450] text-base font-normal font-['Arial'] leading-normal">
                        Pris: 0,5 kr/mottagare
                      </p>
                    </Card.Text>
                  </Card.Body>
                </Card>
              </NextLink>

              {/* Test */}
              <NextLink href={'/send/mail'} passHref className="flex-1">
                <Card
                  className="flex-1  [&_.sk-card-body-wrapper]:!flex [&_.sk-card-body-wrapper]:!flex-col !min-w-[34rem] [&_.sk-btn.sk-btn-md.sk-btn-primary.sk-card-body-icon]:!self-end"
                  color="vattjom"
                  invert={true}
                  useHoverEffect
                >
                  <Card.Body className="flex flex-col !p-[24px]">
                    <Card.Header className="self-stretch inline-flex justify-start items-center gap-12 ">
                      <Icon className="!pl-0 h-5 bg-Dark-Secondary text-[#444450]" size={'28px'} icon={<Mail />} />
                      <div className="font-bold text-[2rem]">Brev</div>
                    </Card.Header>
                    <Card.Text className="">
                      <p className="max-h-">
                        Amet enim adipiscing congue justo adipiscing sagittis volutpat nibh ac. Integer viverra lectus
                        in quisque. In nisl mauris faucibus egestas quis mi nam.
                      </p>
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
                        <p className="text-small">Någon text som beskriver vad skicka sms innebär</p>
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
