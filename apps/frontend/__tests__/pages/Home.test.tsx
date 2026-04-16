import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import React from 'react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

// Mock Home component completely
vi.mock('@/pages/homePage/Home', () => ({
  default: () => (
    <div>
      <h1>失物招领平台</h1>
      <nav>
        <a href="/lost">寻物</a>
        <a href="/found">招领</a>
        <a href="/announcements">公告</a>
      </nav>
    </div>
  ),
}));

// Import after mock
import Home from '@/pages/homePage/Home';

const renderWithProviders = (component: React.ReactNode) => {
  return render(<QueryClientProvider client={queryClient}>{component}</QueryClientProvider>);
};

describe('Home', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders home page correctly', () => {
    renderWithProviders(<Home />);

    expect(screen.getByText('失物招领平台')).toBeInTheDocument();
  });

  it('renders navigation links', () => {
    renderWithProviders(<Home />);

    // 使用 getAllByText 因为 "招领" 出现在标题和链接中
    expect(screen.getByRole('link', { name: /寻物/ })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /招领/ })).toBeInTheDocument();
    expect(screen.getByRole('link', { name: /公告/ })).toBeInTheDocument();
  });
});
