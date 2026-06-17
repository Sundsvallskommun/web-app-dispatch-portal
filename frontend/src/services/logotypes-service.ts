import { ServiceResponse } from '@interfaces/service';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { __DEV__ } from '@sk-web-gui/react';
import { ApiResponse, apiService } from '@services/api-service';
import { Logotype } from '@interfaces/logotype.interface';

interface State {
  logotype: Logotype;
}

interface Actions {
  getLogotype: () => Promise<ServiceResponse<Logotype>>;
  reset: () => void;
}

const initialState: State = {
  logotype: {
    id: '',
    host: '',
    display_name: '',
    logotype_lightmode: '',
    logotype_darkmode: '',
  },
};

const fetchHostLogotypes = (): Promise<ServiceResponse<Logotype>> =>
  apiService
    .get<ApiResponse<Logotype[]>>('/logotypes')
    .then((res) => {
      const first = res.data.data[0];
      if (!first) {
        return { error: 'NOT_FOUND', message: 'No logotype returned' };
      }
      return { data: first };
    })
    .catch((e) => ({
      message: e.response?.data.message,
      error: e.response?.status ?? 'UNKNOWN ERROR',
    }));

export const useLogotypeStore = create<State & Actions>()(
  devtools(
    (set) => ({
      ...initialState,
      getLogotype: async () => {
        const res = await fetchHostLogotypes();
        if (!res.error && res.data) {
          set({ logotype: res.data });
        }
        return res;
      },
      reset: () => set(initialState),
    }),
    { enabled: __DEV__ }
  )
);
