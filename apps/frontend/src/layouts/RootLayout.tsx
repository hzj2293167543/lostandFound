import { Outlet } from 'react-router-dom';
import NavHeader from './components/NavHeader';

export default function RootLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <NavHeader />
      <main className="container mx-auto px-4 py-8">
        <Outlet /> {/* 子路由将在这里渲染 */}
      </main>
    </div>
  );
}
