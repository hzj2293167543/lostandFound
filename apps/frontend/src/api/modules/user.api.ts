import { AxiosRequestConfig } from 'axios';
import { get, post } from '../client';
import { LoginDto, RegisterDto, User } from '@lostfound/schema';

export const userApi = {
  login: (credentials: LoginDto, config?: AxiosRequestConfig) =>
    post<{ token: string; user: User }>('/auth/login', credentials, config),

  register: (data: RegisterDto) => post<{ token: string; user: User }>('/auth/register', data),

  getCurrentUser: () => get<User>('/auth/me'),

  getUserById: (id: number) => get<User>(`/users/${id}`),

  updateUser: (data: Partial<User>) => post<User>('/users/update', data),

  updatePassword: (oldPassword: string, newPassword: string) =>
    post<void>('/users/password', { oldPassword, newPassword }),
};

export default userApi;
