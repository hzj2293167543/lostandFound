import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import FoundCreate from '@/pages/Found/components/FoundCreate';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: false,
    },
  },
});

// Mock API and auth
vi.mock('@/api', () => ({
  uploadApi: {
    upload: vi.fn().mockResolvedValue('https://example.com/image.jpg'),
  },
}));

vi.mock('@/hooks/useAuthAction', () => ({
  useAuthAction: () => (callback: () => void) => callback(),
}));

// Mock react-router hooks that need Data Router context
vi.mock('react-router', async () => {
  const actual = await vi.importActual('react-router');
  return {
    ...actual,
    useSubmit: () => vi.fn(),
    useActionData: () => null,
  };
});

describe('FoundCreate', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders found create dialog trigger correctly', () => {
    const router = createBrowserRouter([
      {
        path: '/',
        element: (
          <QueryClientProvider client={queryClient}>
            <FoundCreate categories={[]} />
          </QueryClientProvider>
        ),
      },
    ]);

    render(<RouterProvider router={router} />);

    // FoundCreate 是一个 Dialog，应该显示触发按钮
    expect(screen.getByRole('button', { name: /发布招领信息/ })).toBeInTheDocument();
  });
});
