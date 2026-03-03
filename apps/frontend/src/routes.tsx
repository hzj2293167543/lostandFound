// frontend/src/routes.tsx
import { createBrowserRouter } from 'react-router-dom';

// 导入布局和页面组件
import RootLayout from './layouts/RootLayout';
import AnnouncementDetail from './pages/Announcement/AnnouncementDetail/AnnouncementDetail';
import Announcements from './pages/Announcement/Announcements/Announcements';
import FoundDetailPage from './pages/Found/FoundDetail/FoundDetail';
import FoundPage from './pages/Found/FoundPage/Found';
import HomePage from './pages/homePage/Home';
import LostDetailPage from './pages/Lost/LostDetail/LostDetail';
import Lost from './pages/Lost/LostPage/Lost';
import ProfilePage from './pages/ProfilePage';
import Error from './pages/Error/Error';

// 导入 loaders
import { foundDetailLoader } from './pages/Found/FoundDetail/foundDetail.loader';
import { foundLoader } from './pages/Found/FoundPage/found.loader';
import { homeLoader } from './pages/homePage/home.loader';
import { lostDetailLoader } from './pages/Lost/LostDetail/lostDetail.loader';
import { lostLoader } from './pages/Lost/LostPage/lost.loader';
import { announcementsLoader } from './pages/Announcement/Announcements/announcements.loader';
import { announcementDetailLoader } from './pages/Announcement/AnnouncementDetail/announcementDetail.loader';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <Error />,
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
        loader: foundLoader,
      },
      {
        path: 'found/:id',
        element: <FoundDetailPage />,
        loader: foundDetailLoader,
      },
      {
        path: 'announcements',
        element: <Announcements />,
        loader: announcementsLoader,
      },
      {
        path: 'announcements/:id',
        element: <AnnouncementDetail />,
        loader: announcementDetailLoader,
      },
      {
        path: 'profile',
        element: <ProfilePage />,
      },
    ],
  },
]);
