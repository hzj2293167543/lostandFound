import { defineMock } from 'vite-plugin-mock-dev-server';

export default defineMock({
  url: '/mock/found-items',
  method: 'GET',
  body: () => {
    return {
      code: 200,
      message: 'success',
      data: [
        {
          id: 1,
          title: '白色AirPods',
          category: '电子产品',
          description: '白色AirPods耳机，带充电盒',
          time: '2024-02-20',
          location: '操场',
          image:
            'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=white%20AirPods%20with%20charging%20case&image_size=square',
        },
        {
          id: 2,
          title: '数学课本',
          category: '学习用品',
          description: '高等数学上册，封面有笔记',
          time: '2024-02-19',
          location: '教室302',
          image:
            'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=mathematics%20textbook%20college%20level&image_size=square',
        },
        {
          id: 3,
          title: '运动水杯',
          category: '生活用品',
          description: '蓝色运动水杯，带刻度',
          time: '2024-02-18',
          location: '体育馆',
          image:
            'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=blue%20sports%20water%20bottle%20with%20scale&image_size=square',
        },
      ],
    };
  },
});
