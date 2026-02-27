import { defineMock } from 'vite-plugin-mock-dev-server';
import { categoryData } from './mock-data';

export const category = defineMock({
  url: '/mock/categories',
  method: 'GET',
  body: () => ({
    code: 200,
    message: 'success',
    data: categoryData.categories,
  }),
});

export default [category];
