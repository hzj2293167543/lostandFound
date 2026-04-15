import { ThemeToggle } from '@/components/ThemeToggle';
import { Button } from '@/components/ui/button';
import { NavigationMenuItem } from '@/components/ui/navigation-menu';
import { useAuthStore, useIsAdmin } from '@/stores/AuthStore';
import {
  FileText,
  LayoutDashboard,
  LogOut,
  Package,
  Users,
  AlertTriangle,
  Brain,
} from 'lucide-react';
import { memo } from 'react';
import { Link, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useShallow } from 'zustand/react/shallow';

const menuItems = [
  { id: 'dashboard', label: '控制台', icon: LayoutDashboard, path: '/admin' },
  { id: 'users', label: '用户管理', icon: Users, path: '/admin/users' },
  { id: 'reports', label: '举报管理', icon: AlertTriangle, path: '/admin/reports' },
  { id: 'categories', label: '分类管理', icon: FileText, path: '/admin/categories' },
  { id: 'lost', label: '失物管理', icon: Package, path: '/admin/lost' },
  { id: 'found', label: '招领管理', icon: Package, path: '/admin/found' },
  { id: 'announcements', label: '公告管理', icon: FileText, path: '/admin/announcements' },
  { id: 'knowledge', label: '知识库导入', icon: Brain, path: '/admin/knowledge' },
];

export default memo(function AdminLayout() {
  const { user, logout } = useAuthStore(
    useShallow((state) => ({
      user: state.user,
      logout: state.logout,
    }))
  );
  const isAdmin = useIsAdmin();
  const navigate = useNavigate();
  const location = useLocation();

  const activeTab = menuItems.find((item) => location.pathname === item.path)?.id || 'dashboard';

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

  return (
    <div className="min-h-screen bg-muted">
      <header className="sticky top-0 bg-background shadow-md">
        <div className="container mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link to="/admin" className="text-xl font-bold text-blue-600">
              后台管理
            </Link>
            <span className="text-muted-foreground">|</span>
            <span className="text-muted-foreground">欢迎，{user?.name}</span>
          </div>

          <div className="flex items-center space-x-4">
            <NavigationMenuItem>
              <ThemeToggle />
            </NavigationMenuItem>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-1" />
              退出
            </Button>
          </div>
        </div>
      </header>

      <div className=" container mx-auto px-4 pt-4">
        <div className=" min-h-[calc(100vh-100px)] flex gap-6">
          <aside className="w-56 bg-background rounded-lg shadow-md p-4">
            <nav className="space-y-2">
              {menuItems.map((item) => (
                <Link
                  key={item.id}
                  to={item.path}
                  className={`flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${
                    activeTab === item.id
                      ? 'bg-blue-100 text-blue-600'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}>
                  <item.icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              ))}
            </nav>
          </aside>

          <main className="flex-1 bg-background rounded-lg shadow-md p-6">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  );
});
