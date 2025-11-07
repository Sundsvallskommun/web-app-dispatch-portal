import { Statistics } from '@interfaces/statistics.interface';
import { useEffect, useState } from 'react';
import { apiService } from '@services/api-service';

export const useStatistics = (): { departmentStatistics: Statistics[]; loaded: boolean } => {
  const [data, setData] = useState<Statistics[]>([]);
  const [loaded, setLoaded] = useState<boolean>(false);

  useEffect(() => {
    apiService.get<Statistics[]>(`statistics/departments`).then((res) => {
      if (res.data) {
        setData(res.data);
        setLoaded(true);
      }
    });
  }, []);

  return { departmentStatistics: data, loaded };
};

export const getStatisticsByDate: (
  year: Number | undefined,
  month: Number | undefined
) => Promise<Statistics[]> = async (year, month) => {
  if (year === undefined && month === undefined) {
    return Promise.reject(new Error('No "year" and "month" supplied'));
  }
  const params = { year, month };
  const res = await apiService.get<Statistics[]>(`statistics/departments`, { params }).catch((e) => {
    throw e;
  });
  return res.data;
};
