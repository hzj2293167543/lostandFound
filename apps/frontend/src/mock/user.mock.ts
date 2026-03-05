import { defineMock } from 'vite-plugin-mock-dev-server';
import { userData } from './mock-data';

const getUserById = defineMock({
  url: '/mock/user/:id',
  method: 'GET',
  body: ({ params }) => {
    const userId = Number(params.id);
    const user = userData.find((u) => u.id === userId);
    if (user) {
      return {
        code: 200,
        data: user,
        message: 'success',
      };
    }
    return {
      code: 404,
      message: 'User not found',
      data: null,
    };
  },
});

const getCurrentUser = defineMock({
  url: '/mock/auth/me',
  method: 'GET',
  body: () => {
    return {
      code: 200,
      data: userData[0],
      message: 'success',
    };
  },
});

export default [getUserById, getCurrentUser];
