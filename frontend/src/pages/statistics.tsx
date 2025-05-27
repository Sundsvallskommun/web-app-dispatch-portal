import DefaultLayout from '@layouts/default-layout/default-layout.component';
import { Spinner, Select, AutoTableHeader, AutoTable } from '@sk-web-gui/react';
import { getStatisticsByDate } from '@services/statistics-service';
import React, { useEffect } from 'react';
import { Statistics } from '@interfaces/statistics.interface';
import dayjs from 'dayjs';

const headers: Array<AutoTableHeader | string> = [
  {
    property: 'department',
    label: 'Förvaltning',
  },
  {
    property: 'snailMail.sent',
    label: 'Fysiska brev (antal)',
  },
  {
    property: 'digitalMail.sent',
    label: 'Digitala brev (antal)',
  },
  // NOTE: To be implemented in the future
  /* {
    property: 'sms.sent',
    label: 'Sms (antal)',
  }, */
];

export const StatisticsPage = () => {
  const [loaded, setLoaded] = React.useState<boolean>(false);

  const [departmentStatistics, setDepartmentStatistics] = React.useState<Statistics[]>([]);
  const [fromDate, setFromDate] = React.useState<string>();
  const [toDate, setToDate] = React.useState<string>();

  useEffect(() => {
    const from = fromDate ?? dayjs(0).format('YYYY-MM-DD');
    const to = toDate ?? dayjs().format('YYYY-MM-DD');

    getStatisticsByDate(from, to)
      .then((res) => {
        setDepartmentStatistics(res);
      })
      .catch((e) => {
        console.error(e);
      })
      .finally(() => {
        if (!loaded) {
          setLoaded(true);
        }
      });
  }, [fromDate, loaded, toDate]);

  const handleDateChange = (date: string) => {
    setLoaded(false);
    if (!date) {
      setFromDate(undefined);
      setToDate(undefined);
      return;
    }

    const [year, month] = date.split('-').map(Number);
    const from = dayjs(`${year}-${month}-01`).format('YYYY-MM-DD');
    const to = dayjs(`${year}-${month}-01`).endOf('month').format('YYYY-MM-DD');

    setFromDate(from);
    setToDate(to);
  };

  const generateMonthOptions = () => {
    const options = [];
    const today = dayjs();

    for (let i = 0; i < 12; i++) {
      const date = today.subtract(i, 'month');
      const value = date.format('YYYY-MM');
      const label = date.format('MMMM YYYY');
      options.push({ value, label });
    }

    return options;
  };

  return (
    <DefaultLayout title={`Postportal`}>
      <div className="text-lg mb-11 pt-32">
        <h1 className="text-h1-lg mb-8">Statistik</h1>
        <p className="text-large text-dark-secondary mt-0">Här hittar du statistik över skickade brev från varje förvaltning. Statistiken sparas ett år bakåt.</p>
        
        <div className="lg:flex flex-row mb-16 mt-56 gap-12 items-center">
          <label className="sk-table-bottom-section-label font-bold" htmlFor="month">
            Månad
          </label>
          <Select id="month" size="sm" onSelectValue={handleDateChange}>
            <Select.Option value="">Välj månad</Select.Option>
            {generateMonthOptions().map((option) => (
              <Select.Option key={option.value} value={option.value}>
                {option.label}
              </Select.Option>
            ))}
          </Select>
        </div>
        <div className="max-w-full mb-80">
          {!loaded && <Spinner />}
          {loaded && departmentStatistics.length === 0 && (
            <div>
              <p className="text-h4-medium md:text-lead leading-lead text-primary font-bold m-0 header-font">
                Ingen statistik hittades.
              </p>
            </div>
          )}
          {loaded && departmentStatistics.length > 0 && (
            <AutoTable
              footer={departmentStatistics.length >= 12}
              pageSize={11}
              autodata={departmentStatistics.length > 0 ? departmentStatistics : []}
              autoheaders={headers}
            />
          )}
        </div>
      </div>
    </DefaultLayout>
  );
};

export default StatisticsPage;
