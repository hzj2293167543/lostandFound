import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User } from '@/types';
import { memo } from 'react';

export default memo(function PersonalInfoDetailSettingList({ userRaw }: { userRaw: User }) {
  return (
    <>
      <h2 className="text-2xl font-bold mb-6">账户设置</h2>
      <Card>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="phone">手机号码</Label>
              <Input id="phone" value={userRaw.contact} disabled />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">邮箱地址</Label>
              <Input id="email" value={userRaw.email} disabled />
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button variant="outline">修改密码</Button>
        </CardFooter>
      </Card>
    </>
  );
});
