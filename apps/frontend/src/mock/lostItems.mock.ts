import { defineMock } from 'vite-plugin-mock-dev-server';
import { lostData } from './mock-data';
export const getLostItemsTop3 = defineMock({
  url: '/mock/lost-items-top3',
  method: 'GET',
  body: () => {
    return {
      code: 200,
      message: 'success',
      data: lostData.lostItemsTop3,
    };
  },
});

export const getLostItems = defineMock({
  url: '/mock/lost-items',
  method: 'GET',
  body: () => {
    return {
      code: 200,
      message: 'success',
      data: lostData.lostItems,
    };
  },
});

export const getLostItemDetail = defineMock({
  url: '/mock/lost-item-detail/:id',
  method: 'GET',
  body: (req) => {
    const id = Number(req.params.id);
    const itemDetail = lostData.lostItemDetail.find((item) => item.id === id);
    if (!itemDetail) {
      return {
        code: 404,
        message: 'item not found',
        data: null,
      };
    }
    return {
      code: 200,
      message: 'success',
      data: itemDetail,
    };
  },
});

export const getLostListByUserId = defineMock({
  url: '/mock/users/:id/lost-items',
  method: 'GET',
  body: (req) => {
    const id = Number(req.params.id);
    const lostItems = lostData.lostItems.filter((item) => item.user?.id === id);
    if (lostItems) {
      return {
        code: 200,
        message: 'success',
        data: lostItems,
      };
    }
    return {
      code: 404,
      message: 'Lost items not found',
      data: null,
    };
  },
});

export default [getLostItemsTop3, getLostItems, getLostItemDetail, getLostListByUserId];
