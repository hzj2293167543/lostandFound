import { LoginDto, RegisterDto, User, UserEditDto, UserEditPasswordDto } from '@lostfound/shared';
import { AxiosRequestConfig } from 'axios';
import { get, patch, post } from '../client';

export const userApi = {
  login: (credentials: LoginDto, config?: AxiosRequestConfig) =>
    post<{ token: string; user: User }>('/auth/login', credentials, config),

  register: (data: RegisterDto) => post<{ token: string; user: User }>('/auth/register', data),

  getCurrentUser: () => get<User>('/auth/me'),

  getUserById: (id: number) => get<User>(`/users/${id}`),

  getAllUsers: () => get<User[]>('/users'),

  updateUser: (data: UserEditDto) => patch<User>('/users', data),

  updatePassword: (data: UserEditPasswordDto) => patch<void>('/users/password', data),
};

export default userApi;
