import { Button } from '@/components/ui/button';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { LostDetail } from '@/types';

export default function LostDetailItem({ lostDetail }: { lostDetail: LostDetail }) {
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
              className={`px-3 py-1 rounded-full text-sm ${lostDetail.status === '寻找中' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
              {lostDetail.status}
            </span>
          </div>
          <CardDescription>分类：{lostDetail.category}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-gray-600 mb-6">
            <p className="mb-4">{lostDetail.description}</p>
            <div className="space-y-2 text-gray-700">
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
          <div className="border-t border-gray-200 pt-4">
            <h3 className="font-semibold text-lg mb-4">发布者信息</h3>
            <div className="flex items-center">
              <img
                src={lostDetail.user.avatar}
                alt={lostDetail.user.name}
                className="w-12 h-12 rounded-full mr-4"
              />
              <div>
                <h4 className="font-medium text-gray-800">{lostDetail.user.name}</h4>
                <p className="text-sm text-gray-600">{lostDetail.user.description}</p>
                <p className="text-sm text-gray-600 mt-1">联系方式：{lostDetail.user.contact}</p>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="bg-blue-600 hover:bg-blue-700">联系发布者</Button>
          <Button variant="outline">分享信息</Button>
        </CardFooter>
      </Card>
    </div>
  );
}
