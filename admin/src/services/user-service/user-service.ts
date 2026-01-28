import { ApiResponse, apiService } from '../api-service';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { __DEV__ } from '@sk-web-gui/react';
import { emptyUser } from './defaults';
import { ServiceResponse } from '@interfaces/services';
import { AdminUser } from '@data-contracts/backend/data-contracts';

const handleSetUserResponse: (res: ApiResponse<AdminUser>) => AdminUser = (res) => res.data;

const getMe: () => Promise<ServiceResponse<AdminUser>> = () => {
  return apiService
    .get<ApiResponse<AdminUser>>('/admin/me')
    .then((res) => ({ data: handleSetUserResponse(res.data) }))
    .catch((e) => ({
      message: e.response?.data.message,
      error: e.response?.status ?? 'UNKNOWN ERROR',
    }));
};

interface State {
  user: AdminUser;
}
interface Actions {
  setUser: (user: AdminUser) => void;
  getMe: () => Promise<ServiceResponse<AdminUser>>;
  reset: () => void;
}

const initialState: State = {
  user: emptyUser,
};

export const useUserStore = create<State & Actions>()(
  devtools(
    (set, get) => ({
      ...initialState,
      setUser: (user) => set(() => ({ user })),
      getMe: async () => {
        let user = get().user;
        const res = await getMe();
        if (!res.error && res.data) {
          user = res.data;
          set(() => ({ user }));
        }
        return { data: user };
      },
      reset: () => {
        set(initialState);
      },
    }),
    { enabled: __DEV__ }
  )
);
