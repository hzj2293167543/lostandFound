import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Announcements from '@/pages/Announcement/Announcements/Announcements';
import React from 'react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

// Mock the hook
vi.mock('@/pages/Announcement/hooks/useAnnouncementInfinite.hook', () => ({
  useAnnouncementInfinite: () => ({
    itemData: { items: [], hasNextPage: false },
    handleScroll: vi.fn(),
    status: 'success',
    rowCount: 0,
    containerRef: { current: null },
    allItems: [],
    isFetching: false,
  }),
}));

const renderWithProviders = (component: React.ReactNode) => {
  return render(
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>{component}</BrowserRouter>
    </QueryClientProvider>
  );
};

describe('Announcements', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders announcements page correctly', () => {
    renderWithProviders(<Announcements />);

    expect(screen.getByText('公告中心')).toBeInTheDocument();
  });

  it('renders search input', () => {
    renderWithProviders(<Announcements />);

    const searchInput = screen.getByPlaceholderText(/搜索公告标题或内容/);
    expect(searchInput).toBeInTheDocument();
  });
});
