import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export function useAuthAction() {
  const { isAuthenticated } = useAuth();

  return (action: () => void, message = '请先登录') => {
    if (!isAuthenticated) {
      toast.error(message);
      return false;
    }
    action();
    return true;
  };
}
