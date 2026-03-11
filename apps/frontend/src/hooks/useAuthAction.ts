import { useIsAuthenticated } from '@/stores/AuthStore';
import { toast } from 'sonner';

export function useAuthAction() {
  const isAuthenticated = useIsAuthenticated();

  return (action: () => void, message = '请先登录') => {
    if (!isAuthenticated) {
      toast.error(message);
      return false;
    }
    action();
    return true;
  };
}
