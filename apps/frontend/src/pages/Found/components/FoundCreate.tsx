import { SyntheticEvent, useState } from 'react';
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

interface FoundCreateProps {
  categories: Category[];
}

export default function FoundCreate({ categories }: FoundCreateProps) {
  const [open, setOpen] = useState(false);

  // 发布招领信息
  const handleSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    // 这里应该处理表单提交逻辑
    setOpen(false);
    // 模拟提交成功后刷新页面
    alert('招领信息发布成功！');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-green-600 hover:bg-green-700">发布招领信息</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>发布招领信息</DialogTitle>
          <DialogDescription>请详细填写招领信息，帮助物品早日回家</DialogDescription>
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
            <Textarea id="description" placeholder="请详细描述物品特征、捡到情况等" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="time">捡到时间</Label>
            <Input id="time" type="date" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">捡到地点</Label>
            <Input id="location" placeholder="请输入捡到的地点" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="storage_location">存储地点</Label>
            <Input id="storage_location" placeholder="请输入存储地点" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contact_phone">联系电话</Label>
            <Input id="contact_phone" placeholder="请输入联系电话" required />
          </div>
          <div className="space-y-2">
            <Label htmlFor="image">图片上传</Label>
            <Input id="image" type="file" accept="image/*" />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              取消
            </Button>
            <Button type="submit" className="bg-green-600 hover:bg-green-700">
              发布
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
