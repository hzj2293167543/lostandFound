import { useAuthStore } from '@/stores/AuthStore';
import { Comment, FoundItem, LostItem } from '@lostfound/shared';
import { useMemo } from 'react';
import { useLoaderData } from 'react-router-dom';
import { FOUND_FILTER_STATUS } from '../Found/type';
import { LOST_FILTER_STATUS } from '../Lost/type';
import LostFoundList from './components/LostFoundList';
import PersonalInformation from './components/PersonalInformation';
import PersonalInformationDetails from './components/PersonalInformationDetails';

export default function ProfilePage() {
  const user = useAuthStore.use.user();
  console.log(user);
  if (!user) {
    return <div>用户未登录</div>;
  }
  const { lostItems, foundItems, comments } = useLoaderData() as {
    lostItems: LostItem[];
    foundItems: FoundItem[];
    comments: Comment[];
  };

  const counts = useMemo(
    () => ({
      lostCount: lostItems.length,
      foundCount: foundItems.length,
      foundSuccessCount: foundItems.filter((item) => item.status === FOUND_FILTER_STATUS.已认领)
        .length,
      lostSuccessCount: lostItems.filter((item) => item.status === LOST_FILTER_STATUS.已找到)
        .length,
    }),
    [lostItems, foundItems]
  );
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">个人中心</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 左侧个人信息 */}
        <div className="lg:col-span-1">
          <PersonalInformation userRaw={user} />
          <LostFoundList counts={counts} />
        </div>

        {/* 右侧内容 */}
        <div className="lg:col-span-2">
          <PersonalInformationDetails
            userRaw={user}
            lostItems={lostItems}
            foundItems={foundItems}
            comments={comments}
          />
        </div>
      </div>
    </div>
  );
}
