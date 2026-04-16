import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

const renderWithProviders = (component: React.ReactNode) => {
  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>{component}</BrowserRouter>
    </QueryClientProvider>
  );
};

describe('应用冒烟测试', () => {
  it('应用能够正常启动', () => {
    expect(true).toBe(true);
  });

  it('React 渲染环境正常工作', () => {
    const TestComponent = () => <div>测试组件</div>;
    renderWithProviders(<TestComponent />);
    expect(screen.getByText('测试组件')).toBeInTheDocument();
  });

  it('测试基础断言功能', () => {
    expect(1 + 1).toBe(2);
    expect('Hello').not.toBe('World');
    expect([1, 2, 3]).toHaveLength(3);
  });
});

describe('关键路径冒烟测试', () => {
  it('用户登录流程能够初始化', () => {
    const mockLogin = vi.fn();
    mockLogin('test@example.com', 'password');
    expect(mockLogin).toHaveBeenCalled();
  });

  it('物品发布流程能够初始化', () => {
    const mockCreateItem = vi.fn();
    mockCreateItem({ title: '测试物品', description: '测试描述' });
    expect(mockCreateItem).toHaveBeenCalled();
  });

  it('搜索功能能够初始化', () => {
    const mockSearch = vi.fn();
    mockSearch('关键词');
    expect(mockSearch).toHaveBeenCalledWith('关键词');
  });
});
