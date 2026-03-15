import { uploadApi } from '@/api';
import type { UploadTypeDto } from '@lostfound/shared';
/**
 * 上传文件
 * @param file 要上传的文件
 * @param type 上传分类，不是文件类型，而是上传的目的
 * @returns 上传后的文件URL
 */
export function uploadFile(file: File, type: UploadTypeDto) {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('type', type);
  return uploadApi.upload(formData);
}
