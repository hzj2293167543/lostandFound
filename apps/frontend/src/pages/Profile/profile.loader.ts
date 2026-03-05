import { lostApi, foundApi, userApi, commentApi } from '@/api';
import { User } from '@/types';

export default async function profileLoader() {
  try {
    const user = (await userApi.getCurrentUser()) as User;
    const id = user.id;
    const [lostItems, foundItems, comments] = await Promise.all([
      lostApi.getLostItemsByUserId(id),
      foundApi.getFoundItemsByUserId(id),
      commentApi.getCommentsByUerId(id),
    ]);
    return {
      user: user,
      lostItems: lostItems,
      foundItems: foundItems,
      comments: comments,
    };
  } catch (error) {
    console.error('Error loading lost items:', error);
    throw new Response('Failed to load lost items', { status: 500 });
  }
}
