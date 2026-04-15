import { adminApi } from '@/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { adminKeys } from '@/queryKeys/admin.key';
import { Category } from '@lostfound/shared';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { ChangeEvent, useState } from 'react';
import { toast } from 'sonner';

export default function AdminCategories() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [formData, setFormData] = useState({ name: '' });
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [deleteCategoryId, setDeleteCategoryId] = useState<number | null>(null);
  const queryClient = useQueryClient();

  const { data: categories = [], isLoading } = useQuery({
    queryKey: adminKeys.categories(),
    queryFn: () => adminApi.getAllCategories(),
  });

  const createMutation = useMutation({
    mutationFn: (name: string) => adminApi.createCategory(name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.categories() });
      toast.success('分类创建成功！');
      closeDialog();
    },
    onError: () => {
      toast.error('创建失败');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, name }: { id: number; name: string }) => adminApi.updateCategory(id, name),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.categories() });
      toast.success('分类更新成功！');
      closeDialog();
    },
    onError: () => {
      toast.error('更新失败');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => adminApi.deleteCategory(id),
    onSuccess: (result) => {
      if (result.success) {
        queryClient.invalidateQueries({ queryKey: adminKeys.categories() });
        toast.success(result.message);
      } else {
        toast.error(result.message);
      }
      closeDeleteDialog();
    },
    onError: () => {
      toast.error('删除失败');
      closeDeleteDialog();
    },
  });

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingCategory(null);
    setFormData({ name: '' });
  };

  const closeDeleteDialog = () => {
    setIsDeleteDialogOpen(false);
    setDeleteCategoryId(null);
  };

  const handleSubmit = (e: ChangeEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('请输入分类名称');
      return;
    }
    if (editingCategory) {
      updateMutation.mutate({ id: editingCategory.id, name: formData.name });
    } else {
      createMutation.mutate(formData.name);
    }
  };

  const handleEdit = (category: Category) => {
    setEditingCategory(category);
    setFormData({ name: category.name });
    setIsDialogOpen(true);
  };

  const handleDeleteClick = (category: Category) => {
    setDeleteCategoryId(category.id);
    setIsDeleteDialogOpen(true);
  };

  const handleDelete = () => {
    if (!deleteCategoryId) return;
    deleteMutation.mutate(deleteCategoryId);
  };

  const handleAdd = () => {
    setEditingCategory(null);
    setFormData({ name: '' });
    setIsDialogOpen(true);
  };

  const isSubmitting = createMutation.isPending || updateMutation.isPending;

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">分类管理</h1>
        <Button onClick={handleAdd}>新增分类</Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((category) => (
          <Card key={category.id}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-base">
                  {category.name}
                  {category.defaultSince !== null && (
                    <span className="ml-2 text-xs text-green-600">(默认)</span>
                  )}
                </CardTitle>
                <div className="space-x-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(category)}
                    disabled={updateMutation.isPending}>
                    编辑
                  </Button>
                  {category.defaultSince === null && (
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDeleteClick(category)}
                      disabled={deleteMutation.isPending}>
                      删除
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-500">ID: {category.id}</p>
            </CardContent>
          </Card>
        ))}
        {categories.length === 0 && (
          <p className="text-gray-500 col-span-full text-center py-8">暂无分类数据</p>
        )}
      </div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editingCategory ? '编辑分类' : '新增分类'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="name">分类名称</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ name: e.target.value })}
                  placeholder="请输入分类名称"
                  disabled={isSubmitting}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={closeDialog} disabled={isSubmitting}>
                取消
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? '保存中...' : editingCategory ? '保存' : '创建'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>删除分类</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <p className="text-gray-600">
              确定要删除这个分类吗？该分类下的物品将自动迁移到默认分类。
            </p>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={closeDeleteDialog}>
              取消
            </Button>
            <Button type="button" onClick={handleDelete} disabled={deleteMutation.isPending}>
              {deleteMutation.isPending ? '删除中...' : '确认删除'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
