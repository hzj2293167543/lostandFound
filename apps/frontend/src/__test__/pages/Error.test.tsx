import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Error from '@/pages/Error/Error';

describe('Error', () => {
  it('renders error page correctly', () => {
    render(
      <BrowserRouter>
        <Error />
      </BrowserRouter>
    );

    expect(screen.getByText(/页面出错了/)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /返回首页/ })).toBeInTheDocument();
  });
});
