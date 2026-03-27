import { useRef, useCallback, useEffectEvent, useMemo, useState } from 'react';
import { useVirtualizer } from '@tanstack/react-virtual';
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
import { Textarea } from '@/components/ui/textarea';
import { adminKeys } from '@/keys/admin';
import { useAdminInfiniteAnnouncements } from '@/hooks/useAdminInfinite';
import { useAuthStore } from '@/stores/AuthStore';
import { formatDateForInput } from '@/utils';
import { Announcement, AnnouncementCreateDto, AnnouncementEditDto } from '@lostfound/shared';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';

const ITEM_HEIGHT = 200;

export default function AdminAnnouncements() {
  const usrId = useAuthStore.use.user()?.id;
  const userName = useAuthStore.use.user()?.name;
  const parentRef = useRef<HTMLDivElement>(null);
  const queryClient = useQueryClient();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    author: userName,
  });

  const { data, isLoading, fetchNextPage, hasNextPage, isFetchingNextPage } =
    useAdminInfiniteAnnouncements(20);

  const announcements = useMemo(() => {
    return data?.pages.flatMap((page) => page.items) || [];
  }, [data]);

  const createMutation = useMutation({
    mutationFn: (data: Partial<AnnouncementCreateDto>) =>
      adminApi.createAnnouncement({ ...data, author: usrId! }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.announcementsInfinite() });
      toast.success('公告发布成功！');
      closeDialog();
    },
    onError: () => {
      toast.error('创建失败');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: number; data: Partial<AnnouncementEditDto> }) =>
      adminApi.updateAnnouncement(id, { ...data, author: usrId! }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.announcementsInfinite() });
      toast.success('公告更新成功！');
      closeDialog();
    },
    onError: () => {
      toast.error('更新失败');
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: number) => adminApi.deleteAnnouncement(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: adminKeys.announcementsInfinite() });
      toast.success('删除成功');
    },
    onError: () => {
      toast.error('删除失败');
    },
  });

  const rowVirtualizer = useVirtualizer({
    count: announcements.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => ITEM_HEIGHT,
    overscan: 5,
  });

  const handleScroll = useCallback(() => {
    const el = parentRef.current;
    if (!el) return;
    const nearBottom = el.scrollHeight - el.scrollTop - el.clientHeight < 500;
    if (nearBottom && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  const closeDialog = () => {
    setIsDialogOpen(false);
    setEditingAnnouncement(null);
    setFormData({ title: '', content: '', author: userName });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.title.trim() || !formData.content.trim()) {
      toast.error('请填写完整的公告信息');
      return;
    }
    if (editingAnnouncement) {
      updateMutation.mutate({
        id: editingAnnouncement.id,
        data: { ...formData, author: usrId! },
      });
    } else {
      createMutation.mutate({ ...formData, author: usrId! });
    }
  };

  const handleEdit = useEffectEvent((announcement: Announcement) => {
    setEditingAnnouncement(announcement);
    setFormData({
      title: announcement.title,
      content: announcement.content,
      author: userName,
    });
    setIsDialogOpen(true);
  });

  const handleDelete = useEffectEvent((id: number) => {
    if (!confirm('确定要删除这条公告吗？')) return;
    deleteMutation.mutate(id);
  });

  const handleAdd = () => {
    setEditingAnnouncement(null);
    setFormData({ title: '', content: '', author: userName });
    setIsDialogOpen(true);
  };

  const renderAnnouncementRow = useCallback(
    (announcement: (typeof announcements)[0]) => (
      <Card key={announcement.id}>
        <CardHeader className="pb-2">
          <div className="flex justify-between items-center">
            <CardTitle className="text-lg">{announcement.title}</CardTitle>
            <div className="space-x-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => handleEdit(announcement)}
                disabled={updateMutation.isPending}>
                编辑
              </Button>
              <Button
                size="sm"
                variant="destructive"
                onClick={() => handleDelete(announcement.id)}
                disabled={deleteMutation.isPending}>
                删除
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-gray-600 line-clamp-2 mb-2">{announcement.content}</p>
          <div className="flex items-center gap-4 text-xs text-gray-500">
            <span>作者: {announcement.author?.name}</span>
            <span>发布时间: {formatDateForInput(announcement.time)}</span>
          </div>
        </CardContent>
      </Card>
    ),
    [updateMutation.isPending, deleteMutation.isPending]
  );

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
        <h1 className="text-2xl font-bold">公告管理</h1>
        <Button onClick={handleAdd}>发布公告</Button>
      </div>

      {announcements.length === 0 ? (
        <p className="text-gray-500 text-center py-8">暂无公告数据</p>
      ) : (
        <div
          ref={parentRef}
          className="h-[650px] overflow-auto"
          style={{ scrollbarWidth: 'none' }}
          onScroll={handleScroll}>
          <div
            style={{
              height: `${rowVirtualizer.getTotalSize()}px`,
              width: '100%',
              position: 'relative',
            }}>
            {rowVirtualizer.getVirtualItems().map((virtualItem) => {
              const announcement = announcements[virtualItem.index];
              if (!announcement) return null;
              return (
                <div
                  key={virtualItem.key}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    transform: `translateY(${virtualItem.start}px)`,
                    padding: '0 0 16px 0',
                  }}>
                  {renderAnnouncementRow(announcement)}
                </div>
              );
            })}
          </div>
        </div>
      )}
      {isFetchingNextPage && (
        <div className="flex justify-center py-4">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
        </div>
      )}

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingAnnouncement ? '编辑公告' : '发布公告'}</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSubmit}>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="title">标题</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="请输入公告标题"
                  disabled={isSubmitting}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="author">作者</Label>
                <Input id="author" value={formData.author} placeholder="请输入作者名称" disabled />
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">内容</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="请输入公告内容"
                  rows={8}
                  disabled={isSubmitting}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={closeDialog} disabled={isSubmitting}>
                取消
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? '保存中...' : editingAnnouncement ? '保存' : '发布'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
