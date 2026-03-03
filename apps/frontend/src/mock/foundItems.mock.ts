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

export const foundItems = defineMock({
  url: '/mock/found-items',
  method: 'GET',
  body: () => {
    return {
      code: 200,
      message: 'success',
      data: foundData.foundItems,
    };
  },
});

export const foundItemById = defineMock({
  url: '/mock/found-item-detail/:id',
  method: 'GET',
  body: (req) => {
    const id = Number(req.params.id);
    const foundItem = foundData.foundItemDetails.find((item) => item.id === id);
    if (foundItem) {
      return {
        code: 200,
        message: 'success',
        data: foundItem,
      };
    }
    return {
      code: 404,
      message: 'Found item not found',
      data: null,
    };
  },
});

export default [foundTop3, foundItems, foundItemById];
