import { Button } from '@/components/ui/button';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';
import { useAuthStore, useIsAdmin, useIsAuthenticated } from '@/stores/AuthStore';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useShallow } from 'zustand/react/shallow';
import { useWebSocket } from '@/contexts/WebSocketContext';
import { Bell } from 'lucide-react';
import NotificationDropdown from '@/components/NotificationDropdown/NotificationDropdown';
import { ThemeToggle } from '@/components/ThemeToggle';

export default function NavHeader() {
  const { user, logout } = useAuthStore(
    useShallow((state) => ({ user: state.user, logout: state.logout }))
  );
  const isAuthenticated = useIsAuthenticated();
  const isAdmin = useIsAdmin();
  const { unreadCount } = useWebSocket();

  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    toast.success('已退出登录');
    if (isAdmin) {
      navigate('/login');
    } else {
      navigate('/');
    }
  };

  return (
    <nav className="bg-background shadow-md sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <Link to={isAdmin ? '/admin' : '/'} className="text-2xl font-bold text-primary">
          {isAdmin ? '管理后台' : '校园失物招领'}
        </Link>
        <NavigationMenu viewport={false}>
          <NavigationMenuList>
            {!isAdmin && (
              <>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link to="/">首页</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link to="/lost">失物寻回</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link to="/found">失物招领</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <NavigationMenuLink asChild>
                    <Link to="/announcements">公告中心</Link>
                  </NavigationMenuLink>
                </NavigationMenuItem>
              </>
            )}
            {isAuthenticated ? (
              <>
                <NavigationMenuItem className="relative">
                  <NavigationMenuTrigger className="flex items-center gap-2">
                    <div className="relative">
                      <Bell className="w-5 h-5" />
                      {unreadCount > 0 && (
                        <div className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                          {unreadCount > 9 ? '9+' : unreadCount}
                        </div>
                      )}
                    </div>
                  </NavigationMenuTrigger>
                  <NavigationMenuContent className="left-1/2 -translate-x-1/2">
                    <NotificationDropdown />
                  </NavigationMenuContent>
                </NavigationMenuItem>
                <NavigationMenuItem>
                  <ThemeToggle />
                </NavigationMenuItem>
              </>
            ) : (
              <NavigationMenuItem>
                <Link to="/login">
                  <Button>登录</Button>
                </Link>
              </NavigationMenuItem>
            )}
            {isAuthenticated && (
              <NavigationMenuItem>
                <NavigationMenuTrigger className="flex items-center gap-2">
                  <div className="relative">
                    <img
                      src={
                        user?.avatar ||
                        'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=default%20user%20avatar&image_size=square'
                      }
                      alt={user?.name}
                      className="w-8 h-8 rounded-full"
                    />
                  </div>
                  <span className="truncate max-w-[5ch]">{user?.name}</span>
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="w-40 p-2 space-y-1">
                    {!isAdmin && (
                      <NavigationMenuLink asChild>
                        <Link to="/profile">个人中心</Link>
                      </NavigationMenuLink>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mt-2 bg-red-500 text-text-destructive-foreground hover:bg-muted-foreground/20 cursor-pointer"
                      onClick={handleLogout}>
                      退出登录
                    </Button>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            )}
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </nav>
  );
}
