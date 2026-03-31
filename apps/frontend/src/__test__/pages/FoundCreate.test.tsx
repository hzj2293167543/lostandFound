import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import FoundCreate from '@/pages/Found/components/FoundCreate';
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

describe('FoundCreate', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders found create form correctly', () => {
    renderWithProviders(<FoundCreate categories={[]} />);

    expect(screen.getByLabelText(/标题/)).toBeInTheDocument();
    expect(screen.getByLabelText(/描述/)).toBeInTheDocument();
    expect(screen.getByLabelText(/捡到时间/)).toBeInTheDocument();
    expect(screen.getByLabelText(/捡到地点/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /发布/ })).toBeInTheDocument();
  });

  it('shows validation error for empty required fields', async () => {
    const user = userEvent.setup();
    renderWithProviders(<FoundCreate categories={[]} />);

    const submitButton = screen.getByRole('button', { name: /发布/ });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/请输入标题/)).toBeInTheDocument();
    });
  });

  it('updates form state on input change', async () => {
    const user = userEvent.setup();
    renderWithProviders(<FoundCreate categories={[]} />);

    const titleInput = screen.getByLabelText(/标题/);
    const descriptionInput = screen.getByLabelText(/描述/);

    await user.type(titleInput, '捡到的雨伞');
    await user.type(descriptionInput, '一把蓝色的雨伞');

    expect(titleInput).toHaveValue('捡到的雨伞');
    expect(descriptionInput).toHaveValue('一把蓝色的雨伞');
  });
});
