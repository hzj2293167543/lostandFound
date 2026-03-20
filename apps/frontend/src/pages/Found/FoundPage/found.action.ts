import { foundApi } from '@/api';
import { queryClient } from '@/lib/queryClient';
import { foundKeys } from '@/queryKeys';
import { getErrorMsg, safeParse } from '@/utils';
import { FoundCreateDto, FoundCreateDtoSchema } from '@lostfound/shared';
import { ActionFunction } from 'react-router-dom';

export const foundAction: ActionFunction = async ({ request }) => {
  try {
    const json = await request.json();
    const parsedData = safeParse<FoundCreateDto>(FoundCreateDtoSchema, json);

    const found = await foundApi.createFoundItem(parsedData);
    await queryClient.refetchQueries({ queryKey: foundKeys.lists() });

    return { success: true, result: found };
  } catch (error) {
    const message = getErrorMsg(error, '创建招领信息失败');
    return { success: false, error: message };
  }
};
