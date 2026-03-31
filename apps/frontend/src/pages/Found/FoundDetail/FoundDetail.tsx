import { Category, FoundDetail, Comment } from '@lostfound/shared';
import { Link, useLoaderData } from 'react-router-dom';
import Comments from './components/comments/Comments';
import FoundAction from './components/FoundAction';
import FoundDetailItem from './components/FoundDetailItem';
import FoundTips from './components/FoundTips';

export default function FoundDetailPage() {
  const { foundDetail } = useLoaderData() as {
    foundDetail: FoundDetail;
    comments: Comment[];
    categories: Category[];
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Link to="/found" className="text-green-600 hover:underline flex items-center mr-4">
          <span>←</span> 返回招领列表
        </Link>
        <h1 className="text-3xl font-bold text-gray-800">招领详情</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <FoundDetailItem foundDetail={foundDetail} />
          <Comments itemId={foundDetail.id} />
        </div>
        <div className="lg:col-span-1">
          <FoundAction foundDetail={foundDetail} />
          <FoundTips />
        </div>
      </div>
    </div>
  );
}
