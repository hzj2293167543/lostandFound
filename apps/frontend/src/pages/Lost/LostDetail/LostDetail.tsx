import { LostDetail } from '@/types';
import { useState } from 'react';
import { Link, useLoaderData } from 'react-router-dom';
import Comments from './components/comments';
import LostAction from './components/LostAction';
import LostDetailItem from './components/LostDetailItem';
import LostTips from './components/LostTips';

export default function LostDetailPage() {
  const lostDetail = useLoaderData() as LostDetail;
  const [comments, setComments] = useState(lostDetail.comments);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-6">
        <Link to="/lost" className="text-blue-600 hover:underline flex items-center mr-4">
          <span>←</span> 返回失物列表
        </Link>
        <h1 className="text-3xl font-bold text-gray-800">失物详情</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 左侧失物详情 */}
        <div className="lg:col-span-2">
          <LostDetailItem lostDetail={lostDetail} />
          {/* 评论区 */}
          <Comments comments={comments} setComments={setComments} />
        </div>
        {/* 右侧相关信息 */}
        <div className="lg:col-span-1">
          {/* 相关操作 */}
          <LostAction />
          {/* 失物招领小提示 */}
          <LostTips />
        </div>
      </div>
    </div>
  );
}
