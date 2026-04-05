import { ChangeEvent, SyntheticEvent, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthStore } from '@/stores/AuthStore';
import { toast } from 'sonner';
import { LoginDto, LoginDtoSchema } from '@lostfound/shared';
import { ROLE } from '@/stores/type';

export default function Login() {
  const [isLoading, setIsLoading] = useState(false);
  const login = useAuthStore.use.login();
  const navigate = useNavigate();

  // 登录表单数据
  const [formData, setFormData] = useState<LoginDto>({
    email: '',
    password: '',
  });
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // 登录表单提交
  const handleSubmit = async (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validationResult = LoginDtoSchema.safeParse(formData);
    if (!validationResult.success) {
      toast.error('请输入正确的邮箱和密码');
      return;
    }
    setIsLoading(true);

    try {
      const user = await login(formData);
      toast.success('登录成功');
      console.log(user);
      if (user.role === ROLE.管理员) {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : '登录失败，请检查邮箱和密码';
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-muted">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1 text-center">
          <CardTitle className="text-2xl font-bold">登录</CardTitle>
          <CardDescription>请输入您的邮箱和密码登录</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">邮箱</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="请输入邮箱"
                value={formData.email}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">密码</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="请输入密码"
                value={formData.password}
                onChange={handleChange}
                disabled={isLoading}
              />
            </div>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? '登录中...' : '登录'}
            </Button>
          </form>
          <div className="mt-4 text-center text-sm">
            <span className="text-gray-600">还没有账号？</span>
            <Link to="/register">
              <Button variant="link" className="p-0 h-auto ml-1">
                立即注册
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
