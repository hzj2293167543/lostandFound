import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import { foundApi } from '@/api';
import { Loader2 } from 'lucide-react';
import AdminFoundDetail from './components/AdminFoundDetail';

export default function AdminFoundDetailPage() {
  const { id } = useParams<{ id: string }>();

  const {
    data: foundDetail,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ['admin-found-detail', id],
    queryFn: () => foundApi.getFoundItemDetailById(Number(id)),
    enabled: !!id,
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  if (isError || !foundDetail) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">加载失败，请重试</p>
      </div>
    );
  }

  return <AdminFoundDetail foundDetail={foundDetail} />;
}
