import { defineMock } from 'vite-plugin-mock-dev-server';
import { commentData } from './mock-data';
export const getCommentsByUerId = defineMock({
  url: '/mock/comment/:userId',
  method: 'GET',
  body: ({ params }) => {
    const userId = Number(params.userId);
    const comments = commentData.filter((c) => c.user.id === userId);
    if (comments.length > 0) {
      return {
        code: 200,
        data: comments,
        message: 'success',
      };
    }
    return {
      code: 404,
      message: 'Comments not found',
      data: [],
    };
  },
});

export default [getCommentsByUerId];
