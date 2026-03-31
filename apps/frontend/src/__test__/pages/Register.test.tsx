import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Register from '@/pages/Login/Register';
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

describe('Register', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders register form correctly', () => {
    renderWithProviders(<Register />);

    expect(screen.getByLabelText(/用户名/)).toBeInTheDocument();
    expect(screen.getByLabelText(/邮箱/)).toBeInTheDocument();
    expect(screen.getByLabelText(/密码/)).toBeInTheDocument();
    expect(screen.getByLabelText(/确认密码/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /注册/ })).toBeInTheDocument();
    expect(screen.getByText(/已有账号？/)).toBeInTheDocument();
  });

  it('shows validation error for empty form', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Register />);

    const submitButton = screen.getByRole('button', { name: /注册/ });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/请输入用户名/)).toBeInTheDocument();
    });
  });

  it('shows validation error for mismatched passwords', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Register />);

    const usernameInput = screen.getByLabelText(/用户名/);
    const emailInput = screen.getByLabelText(/邮箱/);
    const passwordInput = screen.getByLabelText(/密码/);
    const confirmPasswordInput = screen.getByLabelText(/确认密码/);

    await user.type(usernameInput, 'testUser');
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.type(confirmPasswordInput, 'differentPassword');

    const submitButton = screen.getByRole('button', { name: /注册/ });
    await user.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText(/两次输入的密码不一致/)).toBeInTheDocument();
    });
  });

  it('updates form state on input change', async () => {
    const user = userEvent.setup();
    renderWithProviders(<Register />);

    const usernameInput = screen.getByLabelText(/用户名/);
    const emailInput = screen.getByLabelText(/邮箱/);
    const passwordInput = screen.getByLabelText(/密码/);
    const confirmPasswordInput = screen.getByLabelText(/确认密码/);

    await user.type(usernameInput, 'testUser');
    await user.type(emailInput, 'test@example.com');
    await user.type(passwordInput, 'password123');
    await user.type(confirmPasswordInput, 'password123');

    expect(usernameInput).toHaveValue('testUser');
    expect(emailInput).toHaveValue('test@example.com');
    expect(passwordInput).toHaveValue('password123');
    expect(confirmPasswordInput).toHaveValue('password123');
  });
});
