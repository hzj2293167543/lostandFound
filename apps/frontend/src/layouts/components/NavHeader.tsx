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

export default function NavHeader() {
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
        <NavigationMenu viewport={false}>
          <NavigationMenuList>
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
            {isAuthenticated && isAdmin && (
              <NavigationMenuItem>
                <NavigationMenuLink asChild>
                  <Link to="/admin">管理后台</Link>
                </NavigationMenuLink>
              </NavigationMenuItem>
            )}
            {isAuthenticated ? (
              <NavigationMenuItem>
                <NavigationMenuTrigger>
                  <img
                    src={
                      user?.avatar ||
                      'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=default%20user%20avatar&image_size=square'
                    }
                    alt={user?.name}
                    className="w-8 h-8 rounded-full mr-2"
                  />
                  <span className="truncate max-w-[5ch]">{user?.name}</span>
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="w-32 p-1 cursor-pointer">
                    <NavigationMenuLink asChild>
                      <Link to="/profile">个人中心</Link>
                    </NavigationMenuLink>
                    {/* <NavigationMenuLink asChild>
                      <Link to="/profile/lost">我的失物</Link>
                    </NavigationMenuLink>
                    <NavigationMenuLink asChild>
                      <Link to="/profile/found">我的招领</Link>
                    </NavigationMenuLink> */}
                    <Button
                      variant="outline"
                      size="sm"
                      className="w-full mt-2 bg-red-400 text-white hover:bg-gray-400 hover:text-black cursor-pointer"
                      onClick={handleLogout}>
                      退出登录
                    </Button>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
            ) : (
              <NavigationMenuItem>
                <Link to="/login">
                  <Button>登录</Button>
                </Link>
              </NavigationMenuItem>
            )}
          </NavigationMenuList>
        </NavigationMenu>
      </div>
    </nav>
  );
}
