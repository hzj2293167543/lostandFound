import { categoryApi, foundApi } from '@/api';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Category, FoundEditFormData } from '@/types';
import { formatDateForInput } from '@/utils';
import { type ChangeEvent, type SyntheticEvent, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { FOUND_STATUS, FOUND_STATUS_NAME } from '../types';

export default function FoundEdit({ foundItemId }: { foundItemId: number }) {
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState<FoundEditFormData>();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const abortController = new AbortController();
    const fetchFoundDetail = async () => {
      if (!open) return;
      setIsLoading(true);

      try {
        const [foundDetail, categories] = await Promise.all([
          foundApi.getFoundItemDetailById(foundItemId, { signal: abortController.signal }),
          categoryApi.getCategories({ signal: abortController.signal }),
        ]);
        setCategories(categories);
        setFormData((prev) => ({
          ...prev,
          ...foundDetail,
          category: foundDetail.category.id,
          status: foundDetail.status.code,
        }));
      } catch (error) {
        if (error instanceof Error && error.name === 'CanceledError') {
          return;
        }
        const errorMessage = error instanceof Error ? error.message : '获取招领信息失败';
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFoundDetail();
    return () => {
      abortController.abort();
    };
  }, [foundItemId, open]);
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !formData) return;
    // 保存原始 File 对象用于上传
    setFormData((prev) => {
      if (!prev) return prev;
      return { ...prev, imageFile: file };
    });
    // 生成预览 URL
    const reader = new FileReader();
    reader.addEventListener('load', (event) => {
      const result = event.target?.result;
      if (result) {
        setFormData((prev) => {
          if (!prev) return prev;
          return { ...prev, image: result as string };
        });
      }
    });
    reader.addEventListener('error', () => {
      toast.error('图片读取失败');
    });
    reader.readAsDataURL(file);
  };

  const handleChange = (
    e:
      | ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
      | {
          name: string;
          value: string;
        }
  ) => {
    let name: string, value: string | number;
    if ('target' in e) {
      name = e.target.name;
      value = e.target.value;
    } else {
      name = e.name;
      if (!e.value || e.value === 'undefined') return;
      value = Number(e.value);
    }

    setFormData((prev) => {
      if (!prev) return prev;
      return { ...prev, [name]: value };
    });
  };

  // 发布招领信息
  const handleSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData) {
      toast.error('表单数据不完整');
      return;
    }
    setIsLoading(true);

    try {
      // 模拟API调用
      // await new Promise((resolve) => setTimeout(resolve, 1000));

      setOpen(false);
      toast.success('招领信息修改成功！');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '修改招领信息失败';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-green-600 hover:bg-green-700">编辑</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>修改招领信息</DialogTitle>
          <DialogDescription>请谨慎修改招领信息，帮助物品早日回家</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 max-h-[70vh] overflow-y-auto">
          <div className="space-y-2">
            <Label htmlFor="title">物品名称</Label>
            <Input
              id="title"
              placeholder="请输入物品名称"
              required
              name="title"
              value={formData?.title || ''}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">物品分类</Label>
            <Select
              value={String(formData?.category)}
              onValueChange={(value) =>
                handleChange({
                  name: 'category',
                  value,
                })
              }>
              <SelectTrigger id="category">
                <SelectValue placeholder={'选择分类'} />
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
              placeholder="请详细描述物品特征、捡到情况等"
              required
              name="description"
              value={formData?.description || ''}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="status">状态</Label>
            <Select
              value={String(formData?.status) || ''}
              onValueChange={(value) =>
                handleChange({
                  name: 'status',
                  value: value,
                })
              }>
              <SelectTrigger id="status">
                <SelectValue placeholder={FOUND_STATUS_NAME[formData?.status || 0] || '选择状态'} />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(FOUND_STATUS).map(([_, code]) => (
                  <SelectItem key={code} value={String(code)}>
                    {FOUND_STATUS_NAME[code]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="time">捡到时间</Label>
            <Input
              id="time"
              type="date"
              required
              name="time"
              value={formatDateForInput(formData?.time)}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="location">捡到地点</Label>
            <Input
              id="location"
              placeholder="请输入捡到的地点"
              required
              name="location"
              value={formData?.location || ''}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="storage_location">存储地点</Label>
            <Input
              id="storage_location"
              placeholder="请输入存储地点"
              required
              name="storage_location"
              value={formData?.storage_location || ''}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="contact_phone">联系电话</Label>
            <Input
              id="contact_phone"
              placeholder="请输入联系电话"
              required
              name="contact_phone"
              value={formData?.contact_phone || ''}
              onChange={handleChange}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="image">图片上传</Label>
            {formData?.image && (
              <div className="relative">
                <img
                  src={formData.image}
                  alt="预览"
                  className="w-32 h-32 object-cover rounded-md"
                />
              </div>
            )}
            <Input id="image" type="file" accept="image/*" onChange={handleFileChange} />
          </div>
          <DialogFooter className="flex justify-center sm:justify-center">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isLoading}>
              取消
            </Button>
            <Button type="submit" className="bg-green-600 hover:bg-green-700" disabled={isLoading}>
              {isLoading ? '提交中...' : '发布'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
