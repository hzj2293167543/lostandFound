import { lostApi } from '@/api';
import { getErrorMsg, safeParse } from '@/utils';
import { LostCreateDto, LostCreateDtoSchema } from '@lostfound/shared';
import { ActionFunction } from 'react-router-dom';

export const lostAction: ActionFunction = async ({ request }) => {
  try {
    const json = await request.json();
    const parsedData = safeParse<LostCreateDto>(LostCreateDtoSchema, json);

    const lost = await lostApi.createLost(parsedData);
    return { success: true, result: lost }; // 成功后跳转
  } catch (error) {
    // 返回错误信息，供组件中的 useActionData 使用
    const message = getErrorMsg(error, '创建失物信息失败');
    return { success: false, error: message };
  }
};
