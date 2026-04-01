'use no memo';
import { useAuthStore } from '@/stores/AuthStore';
import { Count, User } from '@lostfound/shared';
import { useMemo } from 'react';
import { useLoaderData, useSearchParams } from 'react-router-dom';
import LostFoundList from './components/LostFoundList';
import PersonalInformation from './components/personalInformation/PersonalInformation';
import PersonalInformationDetails from './components/personalInformationDetails/PersonalInformationDetails';

export default function ProfilePage() {
  const { user, lostItemsCount, foundItemsCount } = useLoaderData() as {
    lostItemsCount: Count;
    foundItemsCount: Count;
    user: User;
  };
  const [searchParams] = useSearchParams();
  const userSelf = useAuthStore.use.user();
  const isSelf = user?.id === userSelf?.id;
  const counts = useMemo(
    () => ({
      lostCount: lostItemsCount.totalCount,
      foundCount: foundItemsCount.totalCount,
      foundSuccessCount: foundItemsCount.successCount,
      lostSuccessCount: lostItemsCount.successCount,
    }),
    [lostItemsCount, foundItemsCount]
  );
  const defaultTab = searchParams.get('tab') || 'lost';

  if (!user) {
    return <div>用户未登录</div>;
  }
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-800">个人中心</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* 左侧个人信息 */}
        <div className="lg:col-span-1 sticky top-19 self-start">
          <PersonalInformation userRaw={user} isSelf={isSelf} />
          <LostFoundList counts={counts} />
        </div>

        {/* 右侧内容 */}
        <div className="lg:col-span-2">
          <PersonalInformationDetails isSelf={isSelf} userRaw={user} defaultTab={defaultTab} />
        </div>
      </div>
    </div>
  );
}
