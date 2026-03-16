import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuthStore } from '@/stores/AuthStore';
import { User } from '@lostfound/shared';
import { useState } from 'react';
import { toast } from 'sonner';
import PersonalEdit from './PersonalEdit';

export default function PersonalInformation({ userRaw }: { userRaw: User }) {
  'use no memo';
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(userRaw);
  console.log(user, userRaw);

  const logout = useAuthStore.use.logout();
  const handleLogout = () => {
    try {
      logout();
      setOpen(false);
    } catch {
      toast.error('退出登录失败');
    }
  };
  return (
    <>
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>个人信息</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center">
            <div className="relative mb-4">
              <img
                src={userRaw.avatar}
                alt={userRaw.name}
                className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md"
              />
            </div>
            <h3 className="text-xl font-semibold mb-2">{userRaw.name}</h3>
            <p className="text-gray-500 mb-4">{userRaw.email}</p>
            <p className="text-gray-500 mb-4">{userRaw.contact || '没有填写联系方式'}</p>
            <p className="text-gray-600 text-center mb-6">
              {userRaw.description || '这个人很懒，什么都没有留下'}
            </p>
            <Button className="w-full" onClick={() => setOpen(true)}>
              编辑个人信息
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button variant="outline" className="w-full" onClick={handleLogout}>
            退出登录
          </Button>
        </CardFooter>
      </Card>
      <PersonalEdit userRaw={userRaw} open={open} setOpen={setOpen} />
    </>
  );
}
