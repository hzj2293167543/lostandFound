import { uploadApi } from '@/api';
import { mapFoundFormToCreateDto } from '@/mappers/found.mappers';
import { CreateFound } from '@/services/found.services';
import { FoundCreateDto, UploadTypeDtoObj } from '@lostfound/shared';
import { ActionFunction } from 'react-router-dom';

export const foundAction: ActionFunction = async ({ request }) => {
  try {
    const formData = await request.formData();
    const imageFile = formData.get('image') as File;
    console.log(imageFile);
    const imageFormData = new FormData();
    imageFormData.append('file', imageFile);
    imageFormData.append('type', UploadTypeDtoObj.FOUND);
    const imageUrl = await uploadApi.upload(imageFormData);
    formData.set('image', imageUrl);

    const rawDto: FoundCreateDto = mapFoundFormToCreateDto(formData);
    const result = await CreateFound(rawDto);
    return { success: true, result };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: '创建招领信息失败' };
  }
};
