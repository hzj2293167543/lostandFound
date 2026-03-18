import { foundApi } from '@/api';
import { safeParse } from '@/utils';
import { FoundCreateDto } from '@lostfound/shared';
import { FoundCreateDtoSchema } from '@lostfound/shared';
import { ActionFunction } from 'react-router-dom';

export const foundAction: ActionFunction = async ({ request }) => {
  try {
    const json = await request.json();
    const parsedData = safeParse<FoundCreateDto>(FoundCreateDtoSchema, json);
    const found = await foundApi.createFoundItem(parsedData);
    return { success: true, result: found };
  } catch (error) {
    if (error instanceof Error) {
      return { success: false, error: error.message };
    }
    return { success: false, error: '创建招领信息失败' };
  }
};
