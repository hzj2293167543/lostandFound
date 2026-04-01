import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { lostApi } from '@/api';
import { Loader2 } from 'lucide-react';
import AdminLostDetail from './components/AdminLostDetail';

export default function AdminLostDetailPage() {
  const { id } = useParams<{ id: string }>();

  const {
    data: lostDetail,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['admin-lost-detail', id],
    queryFn: () => lostApi.getLostItemDetailById(Number(id)),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (isError || !lostDetail) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">加载失败，请重试</p>
      </div>
    );
  }

  return <AdminLostDetail lostDetail={lostDetail} />;
}
