import { defineMock } from 'vite-plugin-mock-dev-server';
import { foundData } from './mock-data';

export const getFoundTop3 = defineMock({
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

export const getFoundItems = defineMock({
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

export const getFoundItemById = defineMock({
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

export const getFoundListByUserId = defineMock({
  url: '/mock/users/:id/found-items',
  method: 'GET',
  body: (req) => {
    const id = Number(req.params.id);
    const foundItems = foundData.foundItems.filter((item) => item.user?.id === id);
    if (foundItems) {
      return {
        code: 200,
        message: 'success',
        data: foundItems,
      };
    }
    return {
      code: 404,
      message: 'Found items not found',
      data: null,
    };
  },
});

export default [getFoundTop3, getFoundItems, getFoundItemById, getFoundListByUserId];
