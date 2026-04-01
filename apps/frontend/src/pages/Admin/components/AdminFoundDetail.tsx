import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { FoundDetail, FOUND_STATUS_NAME } from '@lostfound/shared';
import { useNavigate } from 'react-router-dom';

interface AdminFoundDetailProps {
  foundDetail: FoundDetail;
}

export default function AdminFoundDetail({ foundDetail }: AdminFoundDetailProps) {
  const navigate = useNavigate();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Button variant="ghost" onClick={() => navigate('/admin/found')} className="mr-4">
          ← 返回招领列表
        </Button>
        <h1 className="text-3xl font-bold text-gray-800">招领详情</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <Card className="mb-8">
            <div className="h-80 overflow-hidden">
              <img
                src={foundDetail.image}
                alt={foundDetail.title}
                className="w-full h-full object-cover"
              />
            </div>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-2xl">{foundDetail.title}</CardTitle>
                <span
                  className={`px-3 py-1 rounded-full text-sm ${
                    foundDetail.status === 0
                      ? 'bg-red-100 text-red-800'
                      : 'bg-green-100 text-green-800'
                  }`}>
                  {FOUND_STATUS_NAME[foundDetail.status]}
                </span>
              </div>
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
                    <strong>存放地点：</strong>
                    {foundDetail.storageLocation}
                  </p>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-4">
                <h3 className="font-semibold text-lg mb-4">发布者信息</h3>
                <div className="flex items-center">
                  <img
                    src={foundDetail.user?.avatar}
                    alt={foundDetail.user?.name}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <h4 className="font-medium text-gray-800">{foundDetail.user?.name}</h4>
                    <p className="text-sm text-gray-600">{foundDetail.user?.description}</p>
                    <p className="text-sm text-gray-600 mt-1">
                      联系方式：{foundDetail.user?.contact}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>相关信息</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-sm">
                  <p className="text-gray-500">发布时间</p>
                  <p className="font-medium">{foundDetail.time}</p>
                </div>
                <div className="text-sm">
                  <p className="text-gray-500">分类</p>
                  <p className="font-medium">{foundDetail.category.name}</p>
                </div>
                <div className="text-sm">
                  <p className="text-gray-500">当前状态</p>
                  <p className="font-medium">{FOUND_STATUS_NAME[foundDetail.status]}</p>
                </div>
                {foundDetail.commentCount !== undefined && (
                  <div className="text-sm">
                    <p className="text-gray-500">评论数</p>
                    <p className="font-medium">{foundDetail.commentCount}</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
