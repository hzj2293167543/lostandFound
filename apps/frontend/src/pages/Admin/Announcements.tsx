import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { announcementApi } from '@/api';
import { Announcement } from '@lostfound/schema';
import { toast } from 'sonner';

export default function AdminAnnouncements() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingAnnouncement, setEditingAnnouncement] = useState<Announcement | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    author: '管理员',
  });

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const data = await announcementApi.getAnnouncements();
      setAnnouncements(data);
    } catch (error) {
      console.error('获取公告列表失败:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!formData.title.trim() || !formData.content.trim()) {
      toast.error('请填写完整的公告信息');
      return;
    }

    try {
      if (editingAnnouncement) {
        // 编辑公告
        // await announcementApi.updateAnnouncement(editingAnnouncement.id, formData);
        setAnnouncements(
          announcements.map((a) => (a.id === editingAnnouncement.id ? { ...a, ...formData } : a))
        );
        toast.success('公告更新成功！');
      } else {
        // 新增公告
        const newAnnouncement = {
          id: Date.now(),
          title: formData.title,
          content: formData.content,
          author: formData.author,
          time: new Date().toISOString().split('T')[0],
        };
        // await announcementApi.createAnnouncement(formData);
        setAnnouncements([newAnnouncement, ...announcements]);
        toast.success('公告发布成功！');
      }
      setIsDialogOpen(false);
      setEditingAnnouncement(null);
      setFormData({ title: '', content: '', author: '管理员' });
    } catch (error) {
      toast.error('操作失败');
    }
  };

  const handleEdit = (announcement: Announcement) => {
    setEditingAnnouncement(announcement);
    setFormData({
      title: announcement.title,
      content: announcement.content,
      author: announcement.author,
    });
    setIsDialogOpen(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('确定要删除这条公告吗？')) return;

    try {
      // await announcementApi.deleteAnnouncement(id);
      setAnnouncements(announcements.filter((a) => a.id !== id));
      toast.success('删除成功');
    } catch (error) {
      toast.error('删除失败');
    }
  };

  const handleAdd = () => {
    setEditingAnnouncement(null);
    setFormData({ title: '', content: '', author: '管理员' });
    setIsDialogOpen(true);
  };

  if (isLoading) {
    return <div>加载中...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">公告管理</h1>
        <Button onClick={handleAdd}>发布公告</Button>
      </div>

      <div className="space-y-4">
        {announcements.map((announcement) => (
          <Card key={announcement.id}>
            <CardHeader className="pb-2">
              <div className="flex justify-between items-center">
                <CardTitle className="text-lg">{announcement.title}</CardTitle>
                <div className="space-x-2">
                  <Button size="sm" variant="outline" onClick={() => handleEdit(announcement)}>
                    编辑
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(announcement.id)}>
                    删除
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600 line-clamp-2 mb-2">{announcement.content}</p>
              <div className="flex items-center gap-4 text-xs text-gray-500">
                <span>作者: {announcement.author}</span>
                <span>发布时间: {announcement.time}</span>
              </div>
            </CardContent>
          </Card>
        ))}
        {announcements.length === 0 && (
          <p className="text-gray-500 text-center py-8">暂无公告数据</p>
        )}
      </div>

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
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="author">作者</Label>
                <Input
                  id="author"
                  value={formData.author}
                  onChange={(e) => setFormData({ ...formData, author: e.target.value })}
                  placeholder="请输入作者名称"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="content">内容</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  placeholder="请输入公告内容"
                  rows={8}
                />
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                取消
              </Button>
              <Button type="submit">{editingAnnouncement ? '保存' : '发布'}</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
