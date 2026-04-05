import { useLoaderData } from 'react-router-dom';
import Header from './components/Header';
import FoundList from './components/FoundList';
import LostList from './components/LostList';
import AnnouncementList from './components/AnnouncementList';
import { LostItem, FoundItem, Announcement } from '@lostfound/shared';

export default function Home() {
  const { lostItems, foundItems, announcements } = useLoaderData() as {
    lostItems: LostItem[];
    foundItems: FoundItem[];
    announcements: Announcement[];
  };

  return (
    <div className="min-h-svh bg-muted">
      <Header />
      <div className="container mx-auto px-4">
        <FoundList foundItems={foundItems} />
        <LostList lostItems={lostItems} />
        <AnnouncementList announcements={announcements} />
      </div>
    </div>
  );
}
