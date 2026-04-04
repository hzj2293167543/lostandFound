// frontend/src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { QueryClientProvider } from '@tanstack/react-query';
import { router } from './routes';
import './App.css';
import { Toaster } from './components/ui/sonner';
import { queryClient } from './lib/queryClient';
import { toast } from 'sonner';
import { WebSocketProvider } from './contexts/WebSocketContext';
import { ThemeProvider } from './components/ThemeProvider';

window.addEventListener('unhandledrejection', (event) => {
  const error = event.reason;

  if (error?.__IS_GLOBAL_HANDLED__) {
    event.preventDefault();
    return;
  }
  event.preventDefault();
  toast.error(error?.message || '系统发生未知异常');
});

ReactDOM.createRoot(document.querySelector('#root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <WebSocketProvider>
        <ThemeProvider>
          <Toaster theme="system" position="top-center" />
          <RouterProvider router={router} />
        </ThemeProvider>
      </WebSocketProvider>
    </QueryClientProvider>
  </React.StrictMode>
);
