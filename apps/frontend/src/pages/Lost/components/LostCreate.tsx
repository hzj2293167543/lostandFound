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
import { Category } from '@/types';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { type SyntheticEvent, useState } from 'react';
import { Label } from '@/components/ui/label';

export default function LostCreate({ categories }: { categories: Category[] }) {
  const [open, setOpen] = useState(false);
  // 发布失物信息
  const handleSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    // 这里应该处理表单提交逻辑
    setOpen(false);
    // 模拟提交成功后刷新页面
    alert('失物信息发布成功！');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-blue-600 hover:bg-blue-700">发布失物信息</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>发布失物信息</DialogTitle>
          <DialogDescription>请详细填写失物信息，帮助物品早日回家</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">物品名称</Label>
            <Input id="title" placeholder="请输入物品名称" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">物品分类</Label>
            <Select>
              <SelectTrigger id="category">
                <SelectValue placeholder="选择分类" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.name}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">详细描述</Label>
            <Textarea id="description" placeholder="请详细描述物品特征、丢失情况等" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="time">丢失时间</Label>
            <Input id="time" type="date" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">可能地点</Label>
            <Input id="location" placeholder="请输入可能丢失的地点" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="image">图片上传</Label>
            <Input id="image" type="file" accept="image/*" />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              取消
            </Button>
            <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
              发布
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
