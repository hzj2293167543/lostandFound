import { post } from '../client';

export const uploadApi = {
  upload: (file: FormData) => post<string>('/upload/file', file),
};

export default uploadApi;
