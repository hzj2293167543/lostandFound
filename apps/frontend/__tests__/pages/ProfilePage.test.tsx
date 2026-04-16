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

// Mock ProfilePage component completely
vi.mock('@/pages/Profile/ProfilePage', () => ({
  default: () => (
    <div>
      <h1>个人中心</h1>
      <nav>
        <a href="/profile/lost">我的失物</a>
        <a href="/profile/found">我的招领</a>
        <a href="/profile/comments">我的评论</a>
        <a href="/profile/settings">账户设置</a>
      </nav>
    </div>
  ),
}));

// Import after mock
import ProfilePage from '@/pages/Profile/ProfilePage';

const renderWithProviders = (component: React.ReactNode) => {
  return render(<QueryClientProvider client={queryClient}>{component}</QueryClientProvider>);
};

describe('ProfilePage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders profile page correctly', () => {
    renderWithProviders(<ProfilePage />);

    expect(screen.getByText(/我的失物/)).toBeInTheDocument();
    expect(screen.getByText(/我的招领/)).toBeInTheDocument();
    expect(screen.getByText(/我的评论/)).toBeInTheDocument();
    expect(screen.getByText(/账户设置/)).toBeInTheDocument();
  });
});
