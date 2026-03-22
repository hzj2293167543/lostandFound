import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Home from '@/pages/homePage/Home';

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

    expect(screen.getByText(/寻物/)).toBeInTheDocument();
    expect(screen.getByText(/招领/)).toBeInTheDocument();
    expect(screen.getByText(/公告/)).toBeInTheDocument();
  });
});
