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
      // 可以显示联系方式弹窗
      await navigator.clipboard.writeText(foundDetail.contactPhone);
      toast.success(`联系电话：${foundDetail.contactPhone} 已复制到剪贴板`);
    } else if (foundDetail.user?.contact) {
      // 使用临时联系电话
      await navigator.clipboard.writeText(foundDetail.user.contact);
      toast.success(`联系电话：${foundDetail.user.contact} 已复制到剪贴板`);
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
          title: foundDetail.title,
          text: foundDetail.description,
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
    <Card className="mb-8">
      <div className="h-80 overflow-hidden">
        <img
          src={foundDetail.image}
          alt={foundDetail.title}
          className="w-full h-full object-cover"
        />
      </div>
      <CardHeader>
        <CardTitle className="text-2xl">{foundDetail.title}</CardTitle>
        <CardDescription>分类：{foundDetail.category.name}</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="text-gray-600 mb-6">
          <p className="mb-4">{foundDetail.description}</p>
          <div className="space-y-2 text-gray-700">
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

        {/* 发布者信息 */}
        <div className="border-t border-gray-200 pt-4">
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
              <h4 className="font-medium text-gray-800">{foundDetail.user?.name || '未知用户'}</h4>
              <p className="text-sm text-gray-600">{foundDetail.user?.description || ''}</p>
              <p className="text-sm text-gray-600 mt-1">
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
