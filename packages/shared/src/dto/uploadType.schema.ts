import { z } from 'zod';

export const UploadTypeDtoObj = {
  LOST: 'lost',
  FOUND: 'found',
  AVATAR: 'avatar',
} as const;
export type UploadTypeDto = (typeof UploadTypeDtoObj)[keyof typeof UploadTypeDtoObj];

export const MimeSchemas = {
  [UploadTypeDtoObj.LOST]: z.enum(['image/jpeg', 'image/png', 'image/svg+xml']),
  [UploadTypeDtoObj.FOUND]: z.enum(['image/jpeg', 'image/png', 'image/gif']),
  [UploadTypeDtoObj.AVATAR]: z.enum(['image/jpeg', 'image/png', 'image/svg+xml']),
};
