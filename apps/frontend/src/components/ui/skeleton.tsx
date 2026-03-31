import { cn } from '@/lib/utils';
import type { ComponentPropsWithRef } from 'react';

function Skeleton({ className, ...props }: ComponentPropsWithRef<'div'>) {
  return (
    <div
      data-slot="skeleton"
      className={cn('animate-pulse rounded-md bg-accent', className)}
      {...props}
    />
  );
}

export { Skeleton };
