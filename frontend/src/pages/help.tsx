import { Help } from '@components/help/help.component';
import DefaultLayout from '@layouts/default-layout/default-layout.component';
import { PageHeader } from '@layouts/page-header/page-header.component';

export const HelpPage = () => {
  return (
    <DefaultLayout
      title={`Postportalen`}
      pageheader={
        <PageHeader color="vattjom">
          <h1 className="text-h2 m-0">Behöver du hjälp att komma igång?</h1>
          <p className="text-h4-medium md:text-lead leading-lead text-primary font-bold m-0 header-font">
            Här hittar du några vanliga frågor och svar.
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
