import { defineMock } from 'vite-plugin-mock-dev-server';
import { foundData } from './mock-data';
export const foundTop3 = defineMock({
  url: '/mock/found-items-top3',
  method: 'GET',
  body: () => {
    return {
      code: 200,
      message: 'success',
      data: foundData.foundTop3,
    };
  },
});

export default [foundTop3];
