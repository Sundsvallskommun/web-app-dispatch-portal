import DefaultLayout from '@layouts/default-layout/default-layout.component';
import { Spinner, Select, AutoTableHeader, AutoTable } from '@sk-web-gui/react';
import { getStatisticsByDate } from '@services/statistics-service';
import React, { useEffect, useState } from 'react';
import { Statistics } from '@interfaces/statistics.interface';
import dayjs from 'dayjs';
import { GetServerSideProps } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useTranslation } from 'react-i18next';
import HeaderMenu from '@components/header-menu/header-menu.component';
import { getMonthFirstDayDate, getMonthLastDayDate } from '@utils/helpers';

const headers: Array<AutoTableHeader | string> = [
  {
    property: 'department',
    label: 'Förvaltning',
  },
  {
    property: 'snailMail',
    label: 'Fysiska brev',
  },
  {
    property: 'digitalMail',
    label: 'Digitala brev',
  },
  {
    property: 'registeredMail',
    label: 'Rek brev',
  },
  {
    property: 'sms',
    label: 'Sms',
  },
];

export const StatisticsPage = () => {
  const [loaded, setLoaded] = React.useState<boolean>(false);
  const [departmentStatistics, setDepartmentStatistics] = React.useState<Statistics[]>([]);
  const [selectedYear, setSelectedYear] = useState<number | undefined>();
  const [selectedMonth, setSelectedMonth] = useState<number | undefined>();
  const { t } = useTranslation(['common', 'statistics']);

  useEffect(() => {
    getStatisticsByDate(selectedYear, selectedMonth)
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
  }, [loaded, selectedMonth, selectedYear]);

  const handleDateChange = (date: string) => {
    setLoaded(false);
    if (!date) {
      setSelectedYear(undefined);
      setSelectedMonth(undefined);
      return;
    }

    const [year, month] = date.split('-').map(Number);
    setSelectedYear(year);
    setSelectedMonth(month);
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
    <DefaultLayout title={`Postportal`} headerMenu={<HeaderMenu />}>
      <div className="text-lg mb-11 pt-32">
        <h1 className="text-h1-lg mb-8">{t('statistics:title')}</h1>
        <p className="text-large text-dark-secondary mt-0">{`${t('statistics:description')}.`}</p>

        <div className="lg:flex flex-row justify-start mb-16 mt-56 gap-12 items-end">
          <div className="flex flex-col gap-8">
            <label className="sk-table-bottom-section-label font-bold" htmlFor="month">
              {t('statistics:showPerMonth')}
            </label>
            <Select id="month" size="sm" onSelectValue={handleDateChange}>
              <Select.Option value="">{t('common:chooseMonth')}</Select.Option>
              {generateMonthOptions().map((option) => (
                <Select.Option key={option.value} value={option.value}>
                  {option.label}
                </Select.Option>
              ))}
            </Select>
          </div>
          <span className="justify-self-end ml-auto text-dark-secondary text-small">
            {selectedYear &&
              selectedMonth &&
              t('statistics:fromToDates', {
                from: getMonthFirstDayDate(selectedYear, selectedMonth),
                to: getMonthLastDayDate(selectedYear, selectedMonth),
              })}
          </span>
        </div>

        <div className="max-w-full mb-80">
          {!loaded && <Spinner />}
          {loaded && departmentStatistics.length === 0 && (
            <div>
              <p className="text-h4-medium md:text-lead leading-lead text-primary font-bold m-0 header-font">
                {t('statistics:noStatisticsFound')}
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

export const getServerSideProps: GetServerSideProps<object> = async ({ locale }) => ({
  props: {
    ...(await serverSideTranslations(locale ?? 'sv', ['common', 'statistics'])),
  },
});

export default StatisticsPage;
