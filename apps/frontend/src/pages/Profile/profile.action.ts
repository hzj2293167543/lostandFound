import { ActionFunctionArgs } from 'react-router';

import {
  User,
  UserEditDtoSchema,
  UserEditPasswordDto,
  UserEditPasswordDtoSchema,
} from '@lostfound/shared';
import { PROFILE_INTENT } from './types';
import { useAuthStore } from '@/stores/AuthStore';
import { userApi } from '@/api';
import { getErrorMsg, safeParse } from '@/utils';
import { ActionResult } from '@/types/type';

export async function profileAction({
  request,
}: ActionFunctionArgs): Promise<ActionResult<keyof typeof PROFILE_INTENT>> {
  let intent;
  try {
    const json = await request.json();
    intent = json.intent;

    if (intent === PROFILE_INTENT.USER_EDIT) {
      const parsedData = safeParse<User>(UserEditDtoSchema, json);
      await useAuthStore.getState().editUser(parsedData);
    } else if (intent === PROFILE_INTENT.USER_EDIT_PASSWORD) {
      const parsedData = safeParse<UserEditPasswordDto>(UserEditPasswordDtoSchema, json);
      await userApi.updatePassword(parsedData);
    } else {
      throw new Response('Invalid intent', { status: 400 });
    }
    return { success: true, intent };
  } catch (error) {
    const errMsg = getErrorMsg(error, '更新用户信息失败');
    return { success: false, error: errMsg, intent };
  }
}
