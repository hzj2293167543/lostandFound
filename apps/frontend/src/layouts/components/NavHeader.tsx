import { Link, useNavigate } from 'react-router-dom';
import { memo } from 'react';
import { Button } from '@/components/ui/button';
import { useAuthStore, useIsAdmin, useIsAuthenticated } from '@/stores/AuthStore';
import { toast } from 'sonner';
import { useShallow } from 'zustand/react/shallow';

export default memo(function NavHeader() {
  const { user, logout } = useAuthStore(
    useShallow((state) => ({ user: state.user, logout: state.logout }))
  );
  const isAuthenticated = useIsAuthenticated();
  const isAdmin = useIsAdmin();

  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('已退出登录');
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to="/" className="text-2xl font-bold text-blue-600">
          校园失物招领
        </Link>
        <div className="flex space-x-6 items-center">
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
          {isAuthenticated ? (
            <div className="flex items-center space-x-3">
              {isAdmin && (
                <Link to="/admin" className="text-gray-700 hover:text-blue-600 font-medium">
                  管理后台
                </Link>
              )}
              <Link to="/profile">
                <img
                  src={
                    user?.avatar ||
                    'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=default%20user%20avatar&image_size=square'
                  }
                  alt={user?.name}
                  className="w-8 h-8 rounded-full"
                />
              </Link>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                退出
              </Button>
            </div>
          ) : (
            <Link to="/login">
              <Button>登录</Button>
            </Link>
          )}
        </div>
      </div>
    </nav>
  );
});
