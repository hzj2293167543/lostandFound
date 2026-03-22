import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Login from '@/pages/Login/Login';

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

describe('Login', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders login form correctly', () => {
    renderWithProviders(<Login />);

    expect(screen.getByLabelText(/邮箱/)).toBeInTheDocument();
    expect(screen.getByLabelText(/密码/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /登录/ })).toBeInTheDocument();
    expect(screen.getByText(/还没有账号？/)).toBeInTheDocument();
  });

  it('shows validation error for empty email', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Login />);

    const passwordInput = screen.getByLabelText(/密码/);
    await user.type(passwordInput, 'password123');

    const submitButton = screen.getByRole('button', { name: /登录/ });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/请输入正确的邮箱和密码/)).toBeInTheDocument();
    });
  });

  it('shows validation error for invalid email', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Login />);

    const emailInput = screen.getByLabelText(/邮箱/);
    const passwordInput = screen.getByLabelText(/密码/);

    await user.type(emailInput, 'invalid-email');
    await user.type(passwordInput, 'password123');

    const submitButton = screen.getByRole('button', { name: /登录/ });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/请输入正确的邮箱和密码/)).toBeInTheDocument();
    });
  });

  it('updates form state on input change', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Login />);

    const emailInput = screen.getByLabelText(/邮箱/);
    const passwordInput = screen.getByLabelText(/密码/);

    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');

    expect(emailInput).toHaveValue('test@example.com');
    expect(passwordInput).toHaveValue('password123');
  });

  it('disables submit button while loading', () => {
    renderWithProviders(<Login />);

    const emailInput = screen.getByLabelText(/邮箱/);
    const passwordInput = screen.getByLabelText(/密码/);

    userEvent.setup().type(emailInput, 'test@example.com');
    userEvent.setup().type(passwordInput, 'password123');

    const submitButton = screen.getByRole('button', { name: /登录/ });
    expect(submitButton).not.toBeDisabled();
  });
});
