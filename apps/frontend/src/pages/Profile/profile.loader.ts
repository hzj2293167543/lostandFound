import { commentApi, foundApi, lostApi, userApi } from '@/api';
import { useAuthStore } from '@/stores/AuthStore';

export default async function profileLoader({ params }: { params: { id?: number } }) {
  try {
    const user = useAuthStore.getState().user;
    const id = params.id || user?.id;
    if (!id) {
      throw new Response('User not found', { status: 404 });
    }
    const [userResult, lostItems, foundItems, comments] = await Promise.all([
      params.id ? userApi.getUserById(id) : Promise.resolve(user),
      lostApi.getLostItemsByUserId(id),
      foundApi.getFoundItemsByUserId(id),
      commentApi.getCommentsByUserId(id),
    ]);
    return {
      user: userResult,
      lostItems: lostItems,
      foundItems: foundItems,
      comments: comments,
    };
  } catch (error) {
    console.error('Error loading lost items:', error);
    throw new Response('Failed to load lost items', { status: 500 });
  }
}
