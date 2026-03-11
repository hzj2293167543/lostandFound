import { userApi } from '@/api';
import type { LoginBackDto, LoginDto, User } from '@lostfound/shared';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { ROLE } from '../contexts/type';
import { createSelectors } from '@/utils/zustand';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (data: LoginDto) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = createSelectors(
  create<AuthState>()(
    persist(
      immer((set) => ({
        user: null,
        token: null,
        isLoading: true,

        login: async (data: LoginDto) => {
          const response = await userApi.login(data);
          const { token, user } = response as LoginBackDto;
          set({
            token,
            user,
          });
        },
        logout: () => {
          set({
            token: null,
            user: null,
          });
        },
      })),
      {
        name: 'auth-storage', // localStorage 的 key
        storage: createJSONStorage(() => localStorage), // 默认就是 localStorage，可省略
        partialize: (state) => ({ token: state.token, user: state.user }), // 只持久化 token 和 user
        onRehydrateStorage: () => () => {
          // 在 hydration 完成后，更新 isLoading 和派生状态
          // 注意：这里 state 可能是 undefined（如果 storage 为空）
          useAuthStore.setState({
            isLoading: false,
          });
        },
      }
    )
  )
);

export const useIsAuthenticated = () => useAuthStore((state) => !!state.token);
export const useIsAdmin = () => useAuthStore((state) => state.user?.role === ROLE.管理员);
