import { Button } from '@/components/ui/button';
import {
  DialogContent,
  Dialog,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { User } from '@/types';
import { useState } from 'react';
import type { ChangeEvent, SyntheticEvent } from 'react';

export default function PersonalEdit({
  userRaw,
  setUser,
  open,
  setOpen,
}: {
  userRaw: User;
  setUser: (user: User) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
}) {
  const [formData, setFormData] = useState(userRaw);

  // 保存用户信息
  const handleSaveProfile = (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setUser({ ...formData });
    setOpen(false);
    alert('个人信息更新成功！');
  };

  // 处理表单输入变化
  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>编辑个人信息</DialogTitle>
          <DialogDescription>请修改你的个人信息</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSaveProfile} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">姓名</Label>
            <Input
              id="name"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">邮箱</Label>
            <Input
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="phone">手机号码</Label>
            <Input
              id="phone"
              name="phone"
              value={formData.contact}
              onChange={handleInputChange}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">个人描述</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              rows={3}
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              取消
            </Button>
            <Button type="submit">保存</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
