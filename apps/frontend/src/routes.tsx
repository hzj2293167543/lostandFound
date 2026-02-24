// frontend/src/routes.tsx
import { createBrowserRouter } from 'react-router-dom';

// 导入布局和页面组件
import RootLayout from './layouts/RootLayout';
import HomePage from './pages/homePage/Home';
import Lost from './pages/Lost/Lost';
import LostDetailPage from './pages/Lost/components/LostDetailPage';
import FoundPage from './pages/FoundPage';
import FoundDetailPage from './pages/FoundDetailPage';
import AnnouncementsPage from './pages/AnnouncementsPage';
import AnnouncementDetailPage from './pages/AnnouncementDetailPage';
import ProfilePage from './pages/ProfilePage';
import ErrorPage from './pages/ErrorPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <ErrorPage />, // 可选：全局错误边界
    children: [
      { index: true, element: <HomePage /> },
      {
        path: 'lost',
        element: <Lost />,
      },
      {
        path: 'lost/:id',
        element: <LostDetailPage />,
      },
      {
        path: 'found',
        element: <FoundPage />,
      },
      {
        path: 'found/:id',
        element: <FoundDetailPage />,
      },
      {
        path: 'announcements',
        element: <AnnouncementsPage />,
      },
      {
        path: 'announcements/:id',
        element: <AnnouncementDetailPage />,
      },
      {
        path: 'profile',
        element: <ProfilePage />,
      },
    ],
  },
]);
