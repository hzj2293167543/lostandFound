import LostFilter from '@/pages/Lost/LostPage/components/LostFilter';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { beforeEach, describe, expect, it, vi } from 'vitest';
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

describe('LostFilter', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders lost filter correctly', () => {
    renderWithProviders(
      <LostFilter
        categories={[]}
        setFilterState={() => {}}
        filterState={{ status: 0, searchTerm: '', category: 0 }}
      />
    );

    expect(screen.getByText(/分类/)).toBeInTheDocument();
    expect(screen.getByText(/状态/)).toBeInTheDocument();
  });
});
