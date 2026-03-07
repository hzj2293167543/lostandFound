import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useState } from 'react';
import PersonalEdit from './PersonalEdit';
import { User } from '@lostfound/schema';

export default function PersonalInformation({ userRaw }: { userRaw: User }) {
  const [open, setOpen] = useState(false);
  const [user, setUser] = useState(userRaw);

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
                src={user.avatar}
                alt={user.name}
                className="w-32 h-32 rounded-full object-cover border-4 border-white shadow-md"
              />
              <button className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-2 shadow-md">
                <span className="text-sm">更换</span>
              </button>
            </div>
            <h3 className="text-xl font-semibold mb-2">{user.name}</h3>
            <p className="text-gray-500 mb-4">{user.email}</p>
            <p className="text-gray-600 text-center mb-6">{user.description}</p>
            <Button className="w-full" onClick={() => setOpen(true)}>
              编辑个人信息
            </Button>
          </div>
        </CardContent>
        <CardFooter className="flex justify-center">
          <Button variant="outline" className="w-full">
            退出登录
          </Button>
        </CardFooter>
      </Card>
      <PersonalEdit userRaw={user} setUser={setUser} open={open} setOpen={setOpen} />
    </>
  );
}
