import { foundApi } from '@/api';
import { ActionFunction } from 'react-router-dom';

export const foundAction: ActionFunction = async ({ request }) => {
  try {
    const json = await request.json();
    const found = await foundApi.createFoundItem(json);
    return { success: true, result: found };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: '创建招领信息失败' };
  }
};
