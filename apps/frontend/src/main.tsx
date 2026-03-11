// frontend/src/main.tsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from './routes';
import './App.css';
import { Toaster } from './components/ui/sonner';

ReactDOM.createRoot(document.querySelector('#root')!).render(
  <React.StrictMode>
    <Toaster theme="system" position="top-center" />
    <RouterProvider router={router} />
  </React.StrictMode>
);
