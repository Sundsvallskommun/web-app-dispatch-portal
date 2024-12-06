import {Statistics} from "@interfaces/statistics.interface";
import {useEffect, useState} from "react";
import {apiService} from "@services/api-service";

export const useStatistics = (): { departmentStatistics: Statistics[]; loaded: boolean } => {

  const [data, setData] = useState<Statistics[]>([]);
  const [loaded, setLoaded] = useState<boolean>(false);

  useEffect(() => {
    apiService.get<Statistics[]>(`statistics/departments`).then((res) => {
      if(res.data) {
        setData(res.data);
        setLoaded(true);
      }
    })
  }, []);

  return { departmentStatistics: data, loaded }
}

export const getStatisticsByDate: (from: string, to: string) => Promise<Statistics[]> = async (from, to) => {
  if (!from && !to) {
    return Promise.reject('No "to" and "from" supplied');
  }
  const params = { from, to };
  const res = await apiService.get<Statistics[]>(`statistics/departments`, { params }).catch((e) => {
    throw e;
  });
  return res.data;
};