import { userApi } from '@/api';
import { createSelectors } from '@/utils/zustand';
import type { LoginBackDto, LoginDto, User, UserEditDto } from '@lostfound/shared';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { immer } from 'zustand/middleware/immer';
import { ROLE } from '../contexts/type';

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (data: LoginDto) => Promise<void>;
  logout: () => void;
  editUser: (data: UserEditDto) => Promise<void>;
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
        editUser: async (data: UserEditDto) => {
          const response = await userApi.updateUser(data);
          set({
            user: response,
          });
        },
      })),
      {
        name: 'auth-storage', // localStorage 的 key
        storage: createJSONStorage(() => localStorage), // 默认就是 localStorage，可省略
        partialize: (state) => ({ token: state.token, user: state.user }), // 只持久化 token 和 user
        onRehydrateStorage: () => {
          // 持久化完成后，更新 isLoading,防止在从localStorage取数据完成前渲染保护路由
          // 这里可以访问恢复后的 state
          return (error) => {
            if (!error) {
              useAuthStore.setState({ isLoading: false });
            }
          };
        },
      }
    )
  )
);

export const useIsAuthenticated = () => useAuthStore((state) => !!state.token);
export const useIsAdmin = () => useAuthStore((state) => state.user?.role === ROLE.管理员);
