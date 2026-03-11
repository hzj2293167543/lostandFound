import { uploadApi } from '@/api';
import { mapLostFormToCreateDto } from '@/mappers/lost.mappers';
import { CreateLost } from '@/services/lost.services';
import { LostCreateDto, UploadTypeDtoObj } from '@lostfound/shared';
import { ActionFunction } from 'react-router-dom';

export const lostAction: ActionFunction = async ({ request }) => {
  try {
    const formData = await request.formData();
    // 上传图片并获取 URL
    const imageFile = formData.get('image') as File;
    console.log(imageFile);
    const imageFormData = new FormData();
    imageFormData.append('file', imageFile);
    imageFormData.append('type', UploadTypeDtoObj.LOST);
    // 上传图片
    const imageUrl = await uploadApi.upload(imageFormData);
    formData.set('image', imageUrl);

    const rawDto: LostCreateDto = mapLostFormToCreateDto(formData);
    const result = await CreateLost(rawDto);
    return { success: true, result }; // 成功后跳转
  } catch (error) {
    // 返回错误信息，供组件中的 useActionData 使用
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: '创建失物信息失败' };
  }
};
