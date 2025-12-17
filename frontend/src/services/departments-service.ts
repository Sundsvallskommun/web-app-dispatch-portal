import { useEffect, useState } from 'react';
import { apiService } from './api-service';

export const useMyDepartment = (): { myDepartment: string; loaded: boolean } => {
  const [myDepartment, setMyDepartment] = useState<string>('');
  const [loaded, setLoaded] = useState<boolean>(false);

  useEffect(() => {
    apiService.get<string>('my-department').then((res) => {
      setMyDepartment(res.data);
      setLoaded(true);
    });
  }, []);

  return { myDepartment, loaded };
};
