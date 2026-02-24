import { Outlet, Link } from 'react-router-dom';

export default function RootLayout() {
  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-blue-600">
            校园失物招领
          </Link>
          <div className="flex space-x-6">
            <Link to="/" className="text-gray-700 hover:text-blue-600 font-medium">
              首页
            </Link>
            <Link to="/lost" className="text-gray-700 hover:text-blue-600 font-medium">
              失物寻回
            </Link>
            <Link to="/found" className="text-gray-700 hover:text-blue-600 font-medium">
              失物招领
            </Link>
            <Link to="/announcements" className="text-gray-700 hover:text-blue-600 font-medium">
              公告中心
            </Link>
            <Link to="/profile" className="text-gray-700 hover:text-blue-600 font-medium">
              个人中心
            </Link>
          </div>
        </div>
      </nav>
      <main className="container mx-auto px-4 py-8">
        <Outlet /> {/* 子路由将在这里渲染 */}
      </main>
    </div>
  );
}
