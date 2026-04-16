import Error from '@/pages/Error/Error';
import { render, screen } from '@testing-library/react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { describe, expect, it } from 'vitest';

describe('Error', () => {
  it('renders error page correctly', () => {
    const router = createBrowserRouter([
      {
        path: '/',
        element: <Error />,
      },
    ]);

    render(<RouterProvider router={router} />);

    // 检查错误页面元素
    expect(screen.getByText((content) => content.includes('出错了'))).toBeInTheDocument();

    // 检查按钮
    expect(screen.getByRole('button', { name: /返回上一页/ })).toBeInTheDocument();

    // "返回首页" 是 Link 组件，用 getByText 查找
    expect(screen.getByText(/返回首页/)).toBeInTheDocument();
  });
});
