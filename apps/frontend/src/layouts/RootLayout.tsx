import GlobalProgress from '@/components/globalProgress/GlobalProgress';
import { Outlet } from 'react-router-dom';
import NavHeader from './components/NavHeader';
import { useGlobalToast } from '@/hooks/useGlobalToast';
import { AIChatFloatingButton } from '@/components/ai-chat';

export default function RootLayout() {
  useGlobalToast();

  return (
    <div className="min-h-screen bg-gray-50">
      <GlobalProgress />
      <NavHeader />
      <main className="container mx-auto px-4 py-8">
        <Outlet />
      </main>
      <AIChatFloatingButton />
    </div>
  );
}
