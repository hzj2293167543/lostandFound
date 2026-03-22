import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Button } from '../components/ui/button';

describe('Button', () => {
  it('renders button with text', () => {
    render(<Button>点击我</Button>);
    expect(screen.getByRole('button', { name: /点击我/ })).toBeInTheDocument();
  });

  it('renders different variants', () => {
    const { container } = render(<Button variant="outline">Outline</Button>);
    expect(container.firstChild).toHaveClass('border');
  });

  it('renders different sizes', () => {
    const { container: sm } = render(<Button size="sm">Small</Button>);
    const { container: lg } = render(<Button size="lg">Large</Button>);
    
    expect(sm.firstChild).toHaveClass('h-8');
    expect(lg.firstChild).toHaveClass('h-10');
  });

  it('can be disabled', () => {
    render(<Button disabled>Disabled</Button>);
    expect(screen.getByRole('button')).toBeDisabled();
  });
});
