import { User } from '@interfaces/user';
import { ApiResponse, apiService } from '../api-service';
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { __DEV__ } from '@sk-web-gui/react';
import { emptyUser } from './defaults';
import { ServiceResponse } from '@interfaces/service';

const handleSetUserResponse: (res: ApiResponse<User>) => User = (res) => res.data;

const getMe: () => Promise<ServiceResponse<User>> = () => {
  return apiService
    .get<ApiResponse<User>>('me')
    .then((res) => ({ data: handleSetUserResponse(res.data) }))
    .catch((e) => ({
      message: e.response?.data.message,
      error: e.response?.status ?? 'UNKNOWN ERROR',
    }));
};

const getAvatar: () => Promise<string | undefined> = () => {
  return apiService
    .get<Blob>('user/avatar?width=44', { responseType: 'blob' })
    .then((res) => (res.data.size > 0 ? URL.createObjectURL(res.data) : undefined))
    .catch(() => undefined);
};

interface State {
  user: User;
  avatar?: string;
}
interface Actions {
  setUser: (user: User) => void;
  getMe: () => Promise<ServiceResponse<User>>;
  reset: () => void;
}

const initialState: State = {
  user: emptyUser,
  avatar: undefined,
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

          if (!get().avatar) {
            getAvatar().then((avatar) => set(() => ({ avatar })));
          }
        }
        return { data: user };
      },
      reset: () => {
        const { avatar } = get();
        if (avatar) URL.revokeObjectURL(avatar);
        set(initialState);
      },
    }),
    { enabled: __DEV__ }
  )
);
