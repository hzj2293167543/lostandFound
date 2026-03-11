import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Category } from '@lostfound/shared';
import { Form, useActionData } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuthAction } from '@/hooks/useAuthAction';

interface FoundCreateProps {
  categories: Category[];
}

export default function FoundCreate({ categories }: FoundCreateProps) {
  const [open, setOpen] = useState(false);
  const actionData = useActionData();

  useEffect(() => {
    if (actionData?.success) {
      toast.success('招领信息发布成功！');
      setOpen(false);
    } else if (actionData?.error) {
      toast.error(actionData.error);
    }
  }, [actionData]);

  const requireAuth = useAuthAction();
  const handleOpen = (newOpen: boolean) => {
    if (newOpen) {
      requireAuth(() => setOpen(true), '请先登录后才能发布招领信息');
    } else {
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogTrigger asChild>
        <Button className="bg-green-600 hover:bg-green-700">发布招领信息</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>发布招领信息</DialogTitle>
          <DialogDescription>请详细填写招领信息，帮助物品早日回家</DialogDescription>
        </DialogHeader>
        <Form method="post" encType="multipart/form-data" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">物品名称</Label>
            <Input id="title" name="title" placeholder="请输入物品名称" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">物品分类</Label>
            <Select name="category">
              <SelectTrigger id="category">
                <SelectValue placeholder="选择分类" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={String(cat.id)}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">详细描述</Label>
            <Textarea
              id="description"
              name="description"
              placeholder="请详细描述物品特征、捡到情况等"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="time">捡到时间</Label>
            <Input id="time" name="time" type="date" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">捡到地点</Label>
            <Input id="location" name="location" placeholder="请输入捡到的地点" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="storage_location">存储地点</Label>
            <Input
              id="storage_location"
              name="storage_location"
              placeholder="请输入存储地点"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contact_phone">联系电话</Label>
            <Input id="contact_phone" name="contact_phone" placeholder="请输入联系电话" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="image">图片上传</Label>
            <Input id="image" name="image" type="file" accept="image/*" />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              取消
            </Button>
            <Button type="submit" className="bg-green-600 hover:bg-green-700">
              发布
            </Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
