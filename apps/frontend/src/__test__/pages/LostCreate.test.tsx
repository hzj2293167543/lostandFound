import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import LostCreate from '@/pages/Lost/components/LostCreate';
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

describe('LostCreate', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders lost create form correctly', () => {
    renderWithProviders(<LostCreate categories={[]} />);

    expect(screen.getByLabelText(/标题/)).toBeInTheDocument();
    expect(screen.getByLabelText(/描述/)).toBeInTheDocument();
    expect(screen.getByLabelText(/丢失时间/)).toBeInTheDocument();
    expect(screen.getByLabelText(/丢失地点/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /发布/ })).toBeInTheDocument();
  });

  it('shows validation error for empty required fields', async () => {
    const user = userEvent.setup();
    renderWithProviders(<LostCreate categories={[]} />);

    const submitButton = screen.getByRole('button', { name: /发布/ });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/请输入标题/)).toBeInTheDocument();
    });
  });

  it('updates form state on input change', async () => {
    const user = userEvent.setup();
    renderWithProviders(<LostCreate categories={[]} />);

    const titleInput = screen.getByLabelText(/标题/);
    const descriptionInput = screen.getByLabelText(/描述/);

    await user.type(titleInput, '丢失的钱包');
    await user.type(descriptionInput, '一个黑色的钱包');

    expect(titleInput).toHaveValue('丢失的钱包');
    expect(descriptionInput).toHaveValue('一个黑色的钱包');
  });
});
