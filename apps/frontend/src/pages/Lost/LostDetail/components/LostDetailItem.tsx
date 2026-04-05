import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { LostDetail } from '@lostfound/shared';
import { LOST_FILTER_STATUS } from '../../type';
import { toast } from 'sonner';
import { LOST_STATUS_NAME } from '@/pages/Profile/types';

export default function LostDetailItem({ lostDetail }: { lostDetail: LostDetail }) {
  const handleContact = async () => {
    if (lostDetail.user?.contact) {
      // 使用临时联系电话
      await navigator.clipboard.writeText(lostDetail.user.contact);
      toast.success(`联系电话：${lostDetail.user.contact} 已复制到剪贴板`);
    } else {
      toast.error('暂无联系方式');
    }
  };

  // 分享信息
  const handleShare = async () => {
    const shareUrl = window.location.href;
    try {
      // 尝试使用Web Share API
      if (navigator.share) {
        await navigator.share({
          title: lostDetail.title,
          text: lostDetail.description,
          url: shareUrl,
        });
      } else {
        // 回退方案：复制链接
        await navigator.clipboard.writeText(shareUrl);
        toast.success('链接已复制到剪贴板');
      }
    } catch {
      // 最终回退：显示链接
      prompt('复制链接', shareUrl);
    }
  };
  return (
    <div className="lg:col-span-2">
      <Card className="mb-8">
        <div className="h-80 overflow-hidden">
          <img
            src={lostDetail.image}
            alt={lostDetail.title}
            className="w-full h-full object-cover"
          />
        </div>
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle className="text-2xl">{lostDetail.title}</CardTitle>
            <span
              className={`px-3 py-1 rounded-full text-sm ${
                lostDetail.status === LOST_FILTER_STATUS.寻找中
                  ? 'bg-destructive/10 text-destructive'
                  : 'bg-success/10 text-success'
              }`}>
              {LOST_STATUS_NAME[lostDetail.status]}
            </span>
          </div>
          <CardDescription>分类：{lostDetail.category.name}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-muted-foreground mb-6">
            <p className="mb-4">{lostDetail.description}</p>
            <div className="space-y-2 text-foreground/80">
              <p>
                <strong>丢失时间：</strong>
                {lostDetail.time}
              </p>
              <p>
                <strong>可能地点：</strong>
                {lostDetail.location}
              </p>
            </div>
          </div>

          {/* 发布者信息 */}
          <div className="border-t border-border pt-4">
            <h3 className="font-semibold text-lg mb-4">发布者信息</h3>
            <div className="flex items-center">
              <img
                src={lostDetail.user.avatar}
                alt={lostDetail.user.name}
                className="w-12 h-12 rounded-full mr-4"
              />
              <div>
                <h4 className="font-medium text-foreground">{lostDetail.user.name}</h4>
                <p className="text-sm text-muted-foreground">{lostDetail.user.description}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  联系方式：{lostDetail.user.contact}
                </p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleContact}>
            联系发布者
          </Button>
          <Button variant="outline" onClick={handleShare}>
            分享信息
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
