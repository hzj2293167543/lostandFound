import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { FoundDetail } from '@lostfound/shared';
import { toast } from 'sonner';

export default function FoundDetailItem({ foundDetail }: { foundDetail: FoundDetail }) {
  const handleContact = async () => {
    if (foundDetail.contactPhone) {
      await navigator.clipboard.writeText(foundDetail.contactPhone);
      toast.success(`联系电话：${foundDetail.contactPhone} 已复制到剪贴板`);
    } else if (foundDetail.user?.contact) {
      await navigator.clipboard.writeText(foundDetail.user.contact);
      toast.success(`联系电话：${foundDetail.user.contact} 已复制到剪贴板`);
    } else {
      toast.error('暂无联系方式');
    }
  };

  const handleShare = async () => {
    const shareUrl = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({
          title: foundDetail.title,
          text: foundDetail.description,
          url: shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(shareUrl);
        toast.success('链接已复制到剪贴板');
      }
    } catch {
      prompt('复制链接', shareUrl);
    }
  };
  return (
    <Card className="mb-8 overflow-hidden rounded-xl">
      <div className="h-80 flex items-center justify-center bg-muted">
        <img
          src={
            foundDetail.image || new URL('@/assets/image/not-image.png', import.meta.url).toString()
          }
          alt={foundDetail.title}
          className="max-w-full max-h-full object-contain"
        />
      </div>
      <CardHeader>
        <CardTitle className="text-2xl">{foundDetail.title}</CardTitle>
        <CardDescription>分类：{foundDetail.category.name}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-muted-foreground mb-6">
          <p className="mb-4">{foundDetail.description}</p>
          <div className="space-y-2 text-foreground/80">
            <p>
              <strong>捡到时间：</strong>
              {foundDetail.time}
            </p>
            <p>
              <strong>捡到地点：</strong>
              {foundDetail.location}
            </p>
            <p>
              <strong>暂存地点：</strong>
              {foundDetail.storageLocation}
            </p>
            <p>
              <strong>临时联系方式：</strong>
              {foundDetail.contactPhone}
            </p>
          </div>
        </div>

        <div className="border-t border-border pt-4">
          <h3 className="font-semibold text-lg mb-4">发布者信息</h3>
          <div className="flex items-center">
            <img
              src={
                foundDetail.user?.avatar ||
                'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=default%20user%20avatar&image_size=square'
              }
              alt={foundDetail.user?.name || '未知用户'}
              className="w-12 h-12 rounded-full mr-4"
            />
            <div>
              <h4 className="font-medium text-foreground">
                {foundDetail.user?.name || '未知用户'}
              </h4>
              <p className="text-sm text-muted-foreground">{foundDetail.user?.description || ''}</p>
              <p className="text-sm text-muted-foreground mt-1">
                联系方式：{foundDetail.user?.contact || '未提供'}
              </p>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>
        <Button className="bg-green-600 hover:bg-green-700" onClick={handleContact}>
          联系发布者
        </Button>
        <Button variant="outline" onClick={handleShare}>
          分享信息
        </Button>
      </CardFooter>
    </Card>
  );
}
