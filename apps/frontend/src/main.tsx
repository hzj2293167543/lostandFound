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
/**
 * 全局未处理异常处理
 * 用于捕获未处理的 Promise 异常，如网络错误、超时等
 */
window.addEventListener('unhandledrejection', (event) => {
  const error = event.reason;

  if (error?.__IS_GLOBAL_HANDLED__) {
    event.preventDefault(); // 已经处理过的（如401/封禁），静默吃掉，不飘红
    return;
  }
  // 真正漏网之鱼的错误，弹个通用提示保命
  event.preventDefault();
  toast.error(error?.message || '系统发生未知异常');
});

ReactDOM.createRoot(document.querySelector('#root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <Toaster theme="system" position="top-center" />
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>
);
