import z from 'zod';
import { UserEditPasswordDtoSchema } from '@lostfound/shared';

export interface LostFoundCounts {
  lostCount: number;
  foundCount: number;
  foundSuccessCount: number;
  lostSuccessCount: number;
}

export interface LostEditFormData {
  id: number;
  title: string;
  category: number;
  time: string;
  description: string;
  location: string;
  status: number;
  image: string;
  imageFile?: File;
}

export interface FoundEditFormData {
  id: number;
  title: string;
  category: number;
  time: string;
  description: string;
  location: string;
  status: number;
  image: string;
  storageLocation: string;
  contactPhone: string;
  imageFile?: File;
}

export const FOUND_STATUS = {
  招领中: 0,
  已归还: 1,
  已撤销: 2,
};

export const LOST_STATUS = {
  寻找中: 0,
  已找到: 1,
  已撤销: 2,
};

export const FOUND_STATUS_NAME = ['招领中', '已归还', '已撤销'];

export const LOST_STATUS_NAME = ['寻找中', '已找到', '已撤销'];

export const PROFILE_INTENT = {
  USER_EDIT: 'UserEdit',
  USER_EDIT_PASSWORD: 'UserEditPassword',
  FOUND: 'found',
  COMMENT: 'comment',
};

export const passwordSchema = z
  .object({
    ...UserEditPasswordDtoSchema.shape,
    confirmPassword: UserEditPasswordDtoSchema.shape.newPassword,
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: '两次输入的密码不一致',
    path: ['confirmPassword'],
  });

export type PasswordFormValues = z.infer<typeof passwordSchema>;
