// frontend/src/routes.tsx
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';

// 导入布局
import RootLayout from './layouts/RootLayout';
import Error from './pages/Error/Error';

// 懒加载页面组件
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

// 导入 loaders
import { foundDetailLoader } from './pages/Found/FoundDetail/foundDetail.loader';
import { foundLoader } from './pages/Found/FoundPage/found.loader';
import { homeLoader } from './pages/homePage/home.loader';
import { lostDetailLoader } from './pages/Lost/LostDetail/lostDetail.loader';
import { lostLoader } from './pages/Lost/LostPage/lost.loader';
import { announcementsLoader } from './pages/Announcement/Announcements/announcements.loader';
import { announcementDetailLoader } from './pages/Announcement/AnnouncementDetail/announcementDetail.loader';
import profileLoader from './pages/Profile/profile.loader';
import { useAuth } from './contexts/AuthContext';
import { LostCreateAction } from './pages/Lost/LostPage/lost.action';

function Loading() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-gray-500">加载中...</div>
    </div>
  );
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <Loading />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <>{children}</>;
}

function AdminRoute({ children }: { children: React.ReactNode }) {
  const { isAdmin, isLoading } = useAuth();

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
    path: '/login',
    element: (
      <Suspense fallback={<Loading />}>
        <Login />
      </Suspense>
    ),
  },
  {
    path: '/register',
    element: (
      <Suspense fallback={<Loading />}>
        <Register />
      </Suspense>
    ),
  },
  {
    path: '/admin',
    element: (
      <AdminRoute>
        <Suspense fallback={<Loading />}>
          <AdminLayout />
        </Suspense>
      </AdminRoute>
    ),
    children: [
      {
        index: true,
        element: (
          <Suspense fallback={<Loading />}>
            <AdminDashboard />
          </Suspense>
        ),
      },
      {
        path: 'users',
        element: (
          <Suspense fallback={<Loading />}>
            <AdminUsers />
          </Suspense>
        ),
      },
      {
        path: 'categories',
        element: (
          <Suspense fallback={<Loading />}>
            <AdminCategories />
          </Suspense>
        ),
      },
      {
        path: 'lost',
        element: (
          <Suspense fallback={<Loading />}>
            <AdminLost />
          </Suspense>
        ),
      },
      {
        path: 'found',
        element: (
          <Suspense fallback={<Loading />}>
            <AdminFound />
          </Suspense>
        ),
      },
      {
        path: 'announcements',
        element: (
          <Suspense fallback={<Loading />}>
            <AdminAnnouncements />
          </Suspense>
        ),
      },
    ],
  },
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
        path: 'lost',
        element: (
          <Suspense fallback={<Loading />}>
            <Lost />
          </Suspense>
        ),
        loader: lostLoader,
        action: LostCreateAction,
      },
      {
        path: 'lost/:id',
        element: (
          <Suspense fallback={<Loading />}>
            <LostDetailPage />
          </Suspense>
        ),
        loader: lostDetailLoader,
      },
      {
        path: 'found',
        element: (
          <Suspense fallback={<Loading />}>
            <FoundPage />
          </Suspense>
        ),
        loader: foundLoader,
      },
      {
        path: 'found/:id',
        element: (
          <Suspense fallback={<Loading />}>
            <FoundDetailPage />
          </Suspense>
        ),
        loader: foundDetailLoader,
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
      },
    ],
  },
]);
