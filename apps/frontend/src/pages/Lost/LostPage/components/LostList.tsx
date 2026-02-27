import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/card';
import { LostItem } from '@/types';
import { Link } from 'react-router';

export default function LostList({ filteredItems }: { filteredItems: LostItem[] }) {
  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <Card key={item.id} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="h-48 overflow-hidden">
              <img src={item.image} alt={item.title} className="w-full h-full object-cover" />
            </div>
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle>{item.title}</CardTitle>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${item.status === '寻找中' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                  {item.status}
                </span>
              </div>
              <CardDescription>分类：{item.category}</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-gray-600 mb-4 line-clamp-3">{item.description}</p>
              <div className="text-sm text-gray-500 space-y-1">
                <p>丢失时间：{item.time}</p>
                <p>可能地点：{item.location}</p>
              </div>
              <div className="flex items-center mt-4">
                <img
                  src={item.user.avatar}
                  alt={item.user.name}
                  className="w-8 h-8 rounded-full mr-2"
                />
                <span className="text-sm text-gray-700">{item.user.name}</span>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between">
              <Link to={`/lost/${item.id}`} className="text-blue-600 hover:underline">
                查看详情
              </Link>
              <div className="flex items-center">
                <span className="text-sm text-gray-500">{item.commentCount} 条评论</span>
              </div>
            </CardFooter>
          </Card>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <div className="text-center py-16">
          <p className="text-gray-600 text-lg">没有找到匹配的失物信息</p>
        </div>
      )}
    </>
  );
}
