// frontend/src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { router } from './routes';
import './App.css';
import { Toaster } from './components/ui/sonner';
import { queryClient } from './lib/queryClient';

ReactDOM.createRoot(document.querySelector('#root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <Toaster theme="system" position="top-center" />
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>
);
