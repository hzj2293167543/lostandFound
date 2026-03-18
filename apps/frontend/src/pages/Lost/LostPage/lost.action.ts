import { lostApi } from '@/api';
import { ActionFunction } from 'react-router-dom';

export const lostAction: ActionFunction = async ({ request }) => {
  try {
    const json = await request.json();
    const lost = await lostApi.createLost(json);
    return { success: true, result: lost }; // 成功后跳转
  } catch (error) {
    // 返回错误信息，供组件中的 useActionData 使用
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: '创建失物信息失败' };
  }
};
