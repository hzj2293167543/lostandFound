import { User, LoginDto } from '@lostfound/schema';

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isLoading: boolean;
  login: (LoginDto: LoginDto) => Promise<void>;
  logout: () => void;
}

export const STATUS = {
  封禁: 'banned',
  正常: 'normal',
};

export const ROLE = {
  管理员: 1,
  用户: 0,
};
