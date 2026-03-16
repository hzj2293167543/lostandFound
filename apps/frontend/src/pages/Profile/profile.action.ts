import { ActionFunctionArgs } from 'react-router';

import { UserEditDtoSchema, UserEditPasswordDtoSchema } from '@lostfound/shared';
import { PROFILE_INTENT } from './types';
import { useAuthStore } from '@/stores/AuthStore';
import { userApi } from '@/api';

export async function profileAction({ request }: ActionFunctionArgs) {
  let intent;
  try {
    const formData = await request.formData();
    intent = formData.get('intent') as string;
    if (intent === PROFILE_INTENT.USER_EDIT) {
      const userEditDto = UserEditDtoSchema.safeParse(Object.fromEntries(formData));
      if (!userEditDto.success) {
        throw new Response('Invalid user edit data', { status: 400 });
      }
      await useAuthStore.getState().editUser(userEditDto.data);
    } else if (intent === PROFILE_INTENT.USER_EDIT_PASSWORD) {
      const userEditPasswordDto = UserEditPasswordDtoSchema.safeParse(Object.fromEntries(formData));
      if (!userEditPasswordDto.success) {
        throw new Response('Invalid user edit password data', { status: 400 });
      }
      await userApi.updatePassword(userEditPasswordDto.data);
    } else {
      throw new Response('Invalid intent', { status: 400 });
    }
  } catch (error) {
    console.error('Error updating user:', error);
    throw new Response('Failed to update user', { status: 500 });
  }
}
