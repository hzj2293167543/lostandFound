import { Category, FoundDetail } from '@lostfound/schema';
import { useState } from 'react';
import { Link, useLoaderData } from 'react-router-dom';
import Comments from './components/Comments';
import FoundAction from './components/FoundAction';
import FoundDetailItem from './components/FoundDetailItem';
import FoundTips from './components/FoundTips';

function FoundDetailPage() {
  const { foundItem, categories } = useLoaderData() as {
    foundItem: FoundDetail;
    categories: Category[];
  };
  const [comments, setComments] = useState(foundItem.comments || []);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Link to="/found" className="text-green-600 hover:underline flex items-center mr-4">
          <span>←</span> 返回招领列表
        </Link>
        <h1 className="text-3xl font-bold text-gray-800">招领详情</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 左侧招领详情 */}
        <div className="lg:col-span-2">
          {/* 招领基本信息 */}
          <FoundDetailItem foundDetail={foundItem} />

          {/* 评论区 */}
          <Comments comments={comments} setComments={setComments} />
        </div>

        {/* 右侧相关信息 */}
        <div className="lg:col-span-1">
          <FoundAction categories={categories} />
          <FoundTips />
        </div>
      </div>
    </div>
  );
}

export default FoundDetailPage;
