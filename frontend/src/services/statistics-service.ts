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