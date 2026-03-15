import { commentApi, foundApi, lostApi } from '@/api';
import { useAuthStore } from '@/stores/AuthStore';

export default async function profileLoader() {
  try {
    const user = useAuthStore.getState().user;
    const id = user?.id;
    if (!id) {
      throw new Response('User not found', { status: 404 });
    }
    const [lostItems, foundItems, comments] = await Promise.all([
      lostApi.getLostItemsByUserId(id),
      foundApi.getFoundItemsByUserId(id),
      commentApi.getCommentsByUserId(id),
    ]);
    return {
      lostItems: lostItems,
      foundItems: foundItems,
      comments: comments,
    };
  } catch (error) {
    console.error('Error loading lost items:', error);
    throw new Response('Failed to load lost items', { status: 500 });
  }
}
