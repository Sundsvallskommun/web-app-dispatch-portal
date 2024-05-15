import StatusHandler from '@components/status-handler/status-handler';
import DefaultLayout from '@layouts/default-layout/default-layout.component';
import { PageHeader } from '@layouts/page-header/page-header.component';
import NextLink from 'next/link';
import { useRouter } from 'next/router';

export default function Status() {
  const router = useRouter();
  const { id } = router.query;

  return (
    <DefaultLayout
      title={`Postportalen`}
      pageheader={
        <PageHeader color="gronsta">
          <h1 className="leading-display-2-sm md:leading-display-2-md xl:leading-display-2-lg text-display-2-sm md:text-display-2-md xl:text-display-2-lg">
            Leveransstatus
          </h1>
        </PageHeader>
      }
    >
      <div className="w-full">
        <div className="flex flex-col gap-32 justify-start max-w-[120rem]">
          <StatusHandler id={Array.isArray(id) ? id[0] : id || ''} />
          <NextLink href="/" legacyBehavior passHref>
            <a className="sk-btn sk-btn-primary sk-btn-md w-fit" data-color="vattjom">
              Gör ett nytt utskick
            </a>
          </NextLink>
        </div>
      </div>
    </DefaultLayout>
  );
}
