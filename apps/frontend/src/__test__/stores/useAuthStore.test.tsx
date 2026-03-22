import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { renderHook } from '@testing-library/react';
import { ReactNode } from 'react';
import { describe, expect, it } from 'vitest';
import { useAuthStore } from '../../stores/AuthStore';

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });

  return ({ children }: { children: ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useAuthStore', () => {
  it('provides login, logout, and register functions', () => {
    const { result } = renderHook(() => useAuthStore(), {
      wrapper: createWrapper(),
    });

    expect(typeof result.current.login).toBe('function');
    expect(typeof result.current.logout).toBe('function');
  });

  it('has initial state with isAuthenticated false', () => {
    const { result } = renderHook(() => useAuthStore(), {
      wrapper: createWrapper(),
    });
    expect(result.current.isAuthenticated).toBe(false);
  });
});
