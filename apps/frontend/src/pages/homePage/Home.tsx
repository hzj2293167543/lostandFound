import Header from './components/Header';
import FoundList from './components/FoundList';
import LostList from './components/LostList';
import AnnouncementList from './components/AnnouncementList';
import { useHomeData } from './hooks/useHomeData';

export default function Home() {
  const { lostItems, foundItems, announcements, loading } = useHomeData();

  if (loading) {
    return (
      <div className="min-h-svh bg-gray-50 flex items-center justify-center">
        <div className="text-2xl font-bold text-gray-800">加载中...</div>
      </div>
    );
  }

  return (
    <div className="min-h-svh bg-gray-50">
      <Header />
      <div className="container mx-auto px-4">
        <FoundList foundItems={foundItems} />
        <LostList lostItems={lostItems} />
        <AnnouncementList announcements={announcements} />
      </div>
    </div>
  );
}
