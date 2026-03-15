import { ActionFunctionArgs } from 'react-router';

import { UserEditDtoSchema } from '@lostfound/shared';
import { PROFILE_INTENT } from './types';
import { useAuthStore } from '@/stores/AuthStore';

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
    }
  } catch (error) {
    console.error('Error updating user:', error);
    throw new Response('Failed to update user', { status: 500 });
  }
}
