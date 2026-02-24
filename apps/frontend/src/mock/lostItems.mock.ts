import { defineMock } from 'vite-plugin-mock-dev-server';

export default defineMock({
  url: '/mock/lost-items',
  method: 'GET',
  body: () => {
    return {
      code: 200,
      message: 'success',
      data: [
        {
          id: 1,
          title: '蓝色笔记本电脑',
          category: '电子产品',
          description: '联想小新Pro，蓝色外壳，有轻微划痕',
          time: '2024-02-20',
          location: '图书馆三楼',
          status: '寻找中',
          image:
            'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=laptop%20blue%20lenovo%20小新Pro&image_size=square',
        },
        {
          id: 2,
          title: '黑色钱包',
          category: '证件卡包',
          description: '黑色皮质钱包，内有身份证、学生证和银行卡',
          time: '2024-02-19',
          location: '食堂二楼',
          status: '寻找中',
          image:
            'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=black%20leather%20wallet%20men%20style&image_size=square',
        },
        {
          id: 3,
          title: '红色雨伞',
          category: '生活用品',
          description: '折叠式红色雨伞，伞柄有小熊图案',
          time: '2024-02-18',
          location: '教学楼A座',
          status: '已找到',
          image:
            'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=red%20foldable%20umbrella%20bear%20pattern&image_size=square',
        },
      ],
    };
  },
});
