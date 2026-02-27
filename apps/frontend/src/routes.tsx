// frontend/src/routes.tsx
import { createBrowserRouter } from 'react-router-dom';

// 导入布局和页面组件
import RootLayout from './layouts/RootLayout';
import HomePage from './pages/homePage/Home';
import Lost from './pages/Lost/LostPage/Lost';
import LostDetailPage from './pages/Lost/LostDetail/LostDetail';
import FoundPage from './pages/FoundPage';
import FoundDetailPage from './pages/FoundDetailPage';
import AnnouncementsPage from './pages/AnnouncementsPage';
import AnnouncementDetailPage from './pages/AnnouncementDetailPage';
import ProfilePage from './pages/ProfilePage';
import ErrorPage from './pages/ErrorPage';

// 导入 loaders
import { homeLoader } from './pages/homePage/loaders/homeLoader';
import { lostLoader } from './pages/Lost/LostPage/lost.loader';
import { lostDetailLoader } from './pages/Lost/LostDetail/lostDetail.loader';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <HomePage />, loader: homeLoader },
      {
        path: 'lost',
        element: <Lost />,
        loader: lostLoader,
      },
      {
        path: 'lost/:id',
        element: <LostDetailPage />,
        loader: lostDetailLoader,
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
