// hooks/useGlobalToast.ts
import { EVENT } from '@/constants/events';
import { useEffect } from 'react';
import { toast } from 'sonner';

export const useGlobalToast = () => {
  useEffect(() => {
    const handleToast = (event: CustomEvent) => {
      toast.error(event.detail.message);
    };
    window.addEventListener(EVENT.APP_ERROR_TOAST, handleToast as EventListener);

    return () => {
      window.removeEventListener(EVENT.APP_ERROR_TOAST, handleToast as EventListener);
    };
  }, []);
};
