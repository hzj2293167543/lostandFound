// frontend/src/routes.tsx
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';

import RootLayout from './layouts/RootLayout';
import Error from './pages/Error/Error';

const Login = lazy(() => import('./pages/Login/Login'));
const Register = lazy(() => import('./pages/Login/Register'));
const HomePage = lazy(() => import('./pages/homePage/Home'));
const Lost = lazy(() => import('./pages/Lost/LostPage/Lost'));
const LostDetailPage = lazy(() => import('./pages/Lost/LostDetail/LostDetail'));
const FoundPage = lazy(() => import('./pages/Found/FoundPage/Found'));
const FoundDetailPage = lazy(() => import('./pages/Found/FoundDetail/FoundDetail'));
const Announcements = lazy(() => import('./pages/Announcement/Announcements/Announcements'));
const AnnouncementDetail = lazy(
  () => import('./pages/Announcement/AnnouncementDetail/AnnouncementDetail')
);
const ProfilePage = lazy(() => import('./pages/Profile/ProfilePage'));
const AdminLayout = lazy(() => import('./pages/Admin/AdminLayout'));
const AdminDashboard = lazy(() => import('./pages/Admin/Dashboard'));
const AdminUsers = lazy(() => import('./pages/Admin/Users'));
const AdminLost = lazy(() => import('./pages/Admin/Lost'));
const AdminFound = lazy(() => import('./pages/Admin/Found'));
const AdminCategories = lazy(() => import('./pages/Admin/Categories'));
const AdminAnnouncements = lazy(() => import('./pages/Admin/Announcements'));

import { foundDetailLoader } from './pages/Found/FoundDetail/foundDetail.loader';
import { foundDetailAction } from './pages/Found/FoundDetail/foundDetail.action';
import { foundLoader } from './pages/Found/FoundPage/found.loader';
import { foundAction } from './pages/Found/FoundPage/found.action';
import { homeLoader } from './pages/homePage/home.loader';
import { lostDetailLoader } from './pages/Lost/LostDetail/lostDetail.loader';
import { lostLoader } from './pages/Lost/LostPage/lost.loader';
import { announcementsLoader } from './pages/Announcement/Announcements/announcements.loader';
import { announcementDetailLoader } from './pages/Announcement/AnnouncementDetail/announcementDetail.loader';
import profileLoader from './pages/Profile/profile.loader';
import { useAuthStore, useIsAdmin, useIsAuthenticated } from './stores/AuthStore';
import { lostAction } from './pages/Lost/LostPage/lost.action';
import { lostDetailAction } from './pages/Lost/LostDetail/lostDetail.action';
import { profileAction } from './pages/Profile/profile.action';

function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-gray-500">加载中...</div>
    </div>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useIsAuthenticated();
  // const isLoading = useAuthStore.use.isLoading();

  // if (isLoading) {
  //   return <Loading />;
  // }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const isAdmin = useIsAdmin();
  const isLoading = useAuthStore.use.isLoading();

  if (isLoading) {
    return <Loading />;
  }

  if (!isAdmin) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <Error />,
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<Loading />}>
            <HomePage />
          </Suspense>
        ),
        loader: homeLoader,
      },
      {
        path: 'login',
        element: (
          <Suspense fallback={<Loading />}>
            <Login />
          </Suspense>
        ),
      },
      {
        path: 'register',
        element: (
          <Suspense fallback={<Loading />}>
            <Register />
          </Suspense>
        ),
      },
      {
        path: 'lost',
        element: (
          <Suspense fallback={<Loading />}>
            <Lost />
          </Suspense>
        ),
        loader: lostLoader,
        action: lostAction,
      },
      {
        path: 'lost/:id',
        element: (
          <Suspense fallback={<Loading />}>
            <LostDetailPage />
          </Suspense>
        ),
        loader: lostDetailLoader,
        action: lostDetailAction,
      },
      {
        path: 'found',
        element: (
          <Suspense fallback={<Loading />}>
            <FoundPage />
          </Suspense>
        ),
        loader: foundLoader,
        action: foundAction,
      },
      {
        path: 'found/:id',
        element: (
          <Suspense fallback={<Loading />}>
            <FoundDetailPage />
          </Suspense>
        ),
        loader: foundDetailLoader,
        action: foundDetailAction,
      },
      {
        path: 'announcements',
        element: (
          <Suspense fallback={<Loading />}>
            <Announcements />
          </Suspense>
        ),
        loader: announcementsLoader,
      },
      {
        path: 'announcements/:id',
        element: (
          <Suspense fallback={<Loading />}>
            <AnnouncementDetail />
          </Suspense>
        ),
        loader: announcementDetailLoader,
      },
      {
        path: 'profile',
        element: (
          <ProtectedRoute>
            <Suspense fallback={<Loading />}>
              <ProfilePage />
            </Suspense>
          </ProtectedRoute>
        ),
        loader: profileLoader,
        action: profileAction,
      },
    ],
  },
  {
    path: '/admin',
    element: (
      <AdminRoute>
        <AdminLayout />
      </AdminRoute>
    ),
    children: [
      {
        index: true,
        element: <AdminDashboard />,
      },
      {
        path: 'users',
        element: <AdminUsers />,
      },
      {
        path: 'lost',
        element: <AdminLost />,
      },
      {
        path: 'found',
        element: <AdminFound />,
      },
      {
        path: 'categories',
        element: <AdminCategories />,
      },
      {
        path: 'announcements',
        element: <AdminAnnouncements />,
      },
    ],
  },
]);
