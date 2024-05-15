import { useEffect, useState } from 'react';
import { apiService } from './api-service';
import { Organization } from '@interfaces/organization.interface';

export const useDepartments = (): { departments: Organization[]; loaded: boolean } => {
  const [data, setData] = useState<Organization[]>([]);
  const [loaded, setLoaded] = useState<boolean>(false);

  useEffect(() => {
    apiService.get<Organization[]>('departments').then((res) => {
      if (res.data) {
        setData(res.data);
        setLoaded(true);
      }
    });
  }, []);

  return { departments: data, loaded };
};
