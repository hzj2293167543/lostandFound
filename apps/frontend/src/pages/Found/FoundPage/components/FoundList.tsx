import { Link } from 'react-router-dom';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { FoundItem } from '@lostfound/shared';
import { FOUND_STATUS_NAME } from '@/pages/Profile/types';
import { FOUND_FILTER_STATUS } from '../../type';

interface FoundListProps {
  filteredItems: FoundItem[];
}

export default function FoundList({ filteredItems }: FoundListProps) {
  return (
    <>
      {/* 招领列表 */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="h-48 overflow-hidden">
              <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
            </div>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle>
                  <span>{item.title}</span>
                </CardTitle>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${item.status === FOUND_FILTER_STATUS.招领中 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                  {FOUND_STATUS_NAME[item.status]}
                </span>
              </div>
              <CardDescription>分类：{item.category.name}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4 line-clamp-3">{item.description}</p>
              <div className="text-sm text-gray-500 space-y-1">
                <p>捡到时间：{item.time}</p>
                <p>捡到地点：{item.location}</p>
              </div>
              <div className="flex items-center mt-4">
                <img
                  src={
                    item.user?.avatar ||
                    'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=default%20user%20avatar&image_size=square'
                  }
                  alt={item.user?.name || '未知用户'}
                  className="w-8 h-8 rounded-full mr-2"
                />
                <span className="text-sm text-gray-700">{item.user?.name || '未知用户'}</span>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Link to={`/found/${item.id}`} className="text-green-600 hover:underline">
                查看详情
              </Link>
              <div className="flex items-center">
                <span className="text-sm text-gray-500">{item.commentCount || 0} 条评论</span>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-16">
          <p className="text-gray-600 text-lg">没有找到匹配的招领信息</p>
        </div>
      )}
    </>
  );
}
