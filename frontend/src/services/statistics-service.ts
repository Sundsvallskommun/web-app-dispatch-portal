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

export const getStatisticsByDate = async (year?: number, month?: number): Promise<Statistics[]> => {
  if (year === undefined && month === undefined) {
    throw new Error('No "year" and "month" supplied');
  }
  const res = await apiService.get<Statistics[]>(`statistics/departments`, { year, month });
  return res.data;
};
