import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
  Select,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Category } from '@lostfound/shared';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { useEffect, useState } from 'react';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Form, useActionData } from 'react-router-dom';
import { useAuthAction } from '../../../hooks/useAuthAction';

export default function LostCreate({
  categories,
  className,
}: {
  categories: Category[];
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const actionData = useActionData();
  useEffect(() => {
    if (actionData?.success) {
      toast.success('失物信息发布成功！');
      setOpen(false);
    } else if (actionData?.error) {
      toast.error(actionData.error);
    }
  }, [actionData]);
  // 验证登录
  const requireAuth = useAuthAction();

  const handleOpen = (newOpen: boolean) => {
    if (newOpen) {
      requireAuth(() => setOpen(true), '请先登录后才能发布失物信息');
    } else {
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpen}>
      <DialogTrigger asChild>
        <Button className={`bg-blue-600 hover:bg-blue-700 ${className}`}>发布失物信息</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>发布失物信息</DialogTitle>
          <DialogDescription>请详细填写失物信息，帮助物品早日回家</DialogDescription>
        </DialogHeader>
        <Form method="post" encType="multipart/form-data" className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">物品名称</Label>
            <Input id="title" name="title" placeholder="请输入物品名称" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">物品分类</Label>
            <Select
              name="category"
              onValueChange={(value) => categories.find((cat) => String(cat.id) === value)}>
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
              placeholder="请详细描述物品特征、丢失情况等"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="time">丢失时间</Label>
            <Input id="time" name="time" type="date" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">可能地点</Label>
            <Input id="location" name="location" placeholder="请输入可能丢失的地点" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="image">图片上传</Label>
            <Input id="image" name="image" type="file" accept="image/*" />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              取消
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              发布
            </Button>
          </DialogFooter>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
