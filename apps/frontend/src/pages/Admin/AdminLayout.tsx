import { useState } from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';
import { memo } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { LayoutDashboard, Users, Package, FileText, LogOut } from 'lucide-react';

export default memo(function AdminLayout() {
  const { user, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');

  if (!isAdmin) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">权限不足</h1>
          <p className="text-gray-600 mb-4">只有管理员才能访问后台管理</p>
          <Button onClick={() => navigate('/')}>返回首页</Button>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    toast.success('已退出登录');
    navigate('/');
  };

  const menuItems = [
    { id: 'dashboard', label: '控制台', icon: LayoutDashboard, path: '/admin' },
    { id: 'users', label: '用户管理', icon: Users, path: '/admin/users' },
    { id: 'categories', label: '分类管理', icon: FileText, path: '/admin/categories' },
    { id: 'lost', label: '失物管理', icon: Package, path: '/admin/lost' },
    { id: 'found', label: '招领管理', icon: Package, path: '/admin/found' },
    { id: 'announcements', label: '公告管理', icon: FileText, path: '/admin/announcements' },
  ];

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/admin" className="text-xl font-bold text-blue-600">
              后台管理
            </Link>
            <span className="text-gray-500">|</span>
            <span className="text-gray-600">欢迎，{user?.name}</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link to="/" className="text-gray-600 hover:text-blue-600">
              返回首页
            </Link>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-1" />
              退出
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6">
        <div className="flex gap-6">
          <aside className="w-56 bg-white rounded-lg shadow-md p-4">
            <nav className="space-y-2">
              {menuItems.map((item) => (
                <Link
                  key={item.id}
                  to={item.path}
                  className={`flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${
                    activeTab === item.id
                      ? 'bg-blue-100 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                  onClick={() => setActiveTab(item.id)}>
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>
          </aside>

          <main className="flex-1 bg-white rounded-lg shadow-md p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
});
