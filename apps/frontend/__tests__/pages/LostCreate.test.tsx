import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import LostCreate from '@/pages/Lost/components/LostCreate';

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

describe('LostCreate', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders lost create dialog trigger correctly', () => {
    const router = createBrowserRouter([
      {
        path: '/',
        element: (
          <QueryClientProvider client={queryClient}>
            <LostCreate categories={[]} />
          </QueryClientProvider>
        ),
      },
    ]);

    render(<RouterProvider router={router} />);

    // LostCreate 是一个 Dialog，应该显示触发按钮
    expect(screen.getByRole('button', { name: /发布失物信息/ })).toBeInTheDocument();
  });
});
