import { categoryApi, lostApi } from '@/api';
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
import { Category, LostDetail } from '@lostfound/schema';
import { formatDateForInput } from '@/utils';
import { useEffect, useState } from 'react';
import type { ChangeEvent, SyntheticEvent } from 'react';
import { toast } from 'sonner';
import { LOST_STATUS, LOST_STATUS_NAME, LostEditFormData } from '../types';

export default function LostEdit({ lostItemId }: { lostItemId: number }) {
  const [open, setOpen] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);
  const [formData, setFormData] = useState<LostEditFormData>();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const abortController = new AbortController();
    const fetchLostDetail = async () => {
      if (!open) return;
      setIsLoading(true);

      try {
        const [lostDetail, categories]: [LostDetail, Category[]] = await Promise.all([
          lostApi.getLostItemDetailById(lostItemId, { signal: abortController.signal }),
          categoryApi.getCategories({ signal: abortController.signal }),
        ]);
        setCategories(categories);
        setFormData((prev) => ({
          ...prev,
          ...lostDetail,
          category: lostDetail.category.id,
          status: lostDetail.status,
        }));
      } catch (error) {
        if (error instanceof Error && error.name === 'CanceledError') {
          return;
        }
        const errorMessage = error instanceof Error ? error.message : '获取失物信息失败';
        toast.error(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };
    fetchLostDetail();
    return () => {
      abortController.abort();
    };
  }, [lostItemId, open]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !formData) return;

    setFormData((prev) => {
      if (!prev) return prev;
      return { ...prev, imageFile: file };
    });

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

  const handleSubmit = (e: SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData) {
      toast.error('表单数据不完整');
      return;
    }
    setIsLoading(true);

    try {
      setOpen(false);
      toast.success('失物信息修改成功！');
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : '修改失物信息失败';
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">编辑</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>修改失物信息</DialogTitle>
          <DialogDescription>请谨慎修改失物信息，帮助物品早日找到</DialogDescription>
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
              placeholder="请详细描述物品特征、丢失情况等"
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
                  value,
                })
              }>
              <SelectTrigger id="status">
                <SelectValue placeholder={LOST_STATUS_NAME[formData?.status || 0] || '选择状态'} />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(LOST_STATUS).map(([_, code]) => (
                  <SelectItem key={code} value={String(code)}>
                    {LOST_STATUS_NAME[code]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="time">丢失时间</Label>
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
            <Label htmlFor="location">丢失地点</Label>
            <Input
              id="location"
              placeholder="请输入丢失的地点"
              required
              name="location"
              value={formData?.location || ''}
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
            <Button type="submit" disabled={isLoading}>
              {isLoading ? '提交中...' : '发布'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
