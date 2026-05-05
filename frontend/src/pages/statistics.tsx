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
    renderColumn: (value: string) => <p className="font-bold">{value}</p>,
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

const generateMonthOptions = () => {
  const options = [];
  const today = dayjs();
  const earliest = dayjs('2026-01-01');

  const monthsSinceEarliest = today.diff(earliest, 'month');
  const limit = Math.min(12, monthsSinceEarliest + 1);

  for (let i = 0; i < limit; i++) {
    const date = today.subtract(i, 'month');
    options.push({
      value: date.format('YYYY-MM'),
      label: date.format('MMMM YYYY'),
    });
  }

  return options;
};

export const StatisticsPage = () => {
  const [initialYear, initialMonth] = generateMonthOptions()[0].value.split('-');

  const [loaded, setLoaded] = React.useState<boolean>(false);
  const [departmentStatistics, setDepartmentStatistics] = React.useState<Statistics[]>([]);
  const [selectedYear, setSelectedYear] = useState<string>(initialYear);
  const [selectedMonth, setSelectedMonth] = useState<string>(initialMonth);
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
      setSelectedYear(initialYear);
      setSelectedMonth(initialMonth);
      return;
    }

    const [year, month] = date.split('-');
    setSelectedYear(year);
    setSelectedMonth(month);
  };

  return (
    <DefaultLayout title={t('common:appTitle')} headerMenu={<HeaderMenu />}>
      <h1 className="mt-64">{t('statistics:title')}</h1>
      <p className="text-large">{`${t('statistics:description')}`}</p>

      <div className="lg:flex flex-row justify-between mb-24 mt-56">
        <div className="flex flex-col gap-8">
          <label className="sk-table-bottom-section-label font-bold" htmlFor="month">
            {t('statistics:showPerMonth')}
          </label>
          <Select
            className="w-[200px]"
            id="month"
            size="sm"
            onSelectValue={handleDateChange}
            value={`${selectedYear}-${selectedMonth}`}
          >
            {generateMonthOptions().map((option) => (
              <Select.Option key={option.value} value={option.value}>
                {option.label}
              </Select.Option>
            ))}
          </Select>
        </div>
        <p className="self-end text-dark-secondary text-small">
          {selectedYear &&
            selectedMonth &&
            t('statistics:fromToDates', {
              from: getMonthFirstDayDate(Number(selectedYear), Number(selectedMonth)),
              to: getMonthLastDayDate(Number(selectedYear), Number(selectedMonth)),
            })}
        </p>
      </div>

      <div className="max-w-full mb-80">
        {!loaded && <Spinner />}
        {loaded && departmentStatistics.length === 0 && <p>{t('statistics:noStatisticsFound')}</p>}
        {loaded && departmentStatistics.length > 0 && (
          <AutoTable
            footer={departmentStatistics.length >= 12}
            pageSize={11}
            autodata={departmentStatistics.length > 0 ? departmentStatistics : []}
            autoheaders={headers}
          />
        )}
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
