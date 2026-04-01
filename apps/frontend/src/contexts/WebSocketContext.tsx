import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
  useEffectEvent,
} from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuthStore } from '@/stores/AuthStore';
import { NotificationSchema, NotificationType } from '@lostfound/shared';
import type { Notification } from '@lostfound/shared';

interface WebSocketNotification {
  id: number | string;
  type: 'like' | 'report' | 'comment';
  message: string;
  targetId?: number;
  targetType?: string;
  relatedUserId?: number;
  relatedUserName?: string;
  createdAt: Date;
  read: boolean;
}

interface WebSocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  notifications: WebSocketNotification[];
  unreadCount: number;
  markAsRead: (id: number | string) => void;
  markAllAsRead: () => void;
  clearNotifications: () => void;
  refreshNotifications: () => Promise<void>;
}

const WebSocketContext = createContext<WebSocketContextType | null>(null);

const typeMap: Record<number, 'like' | 'report' | 'comment'> = {
  [NotificationType.Like]: 'like',
  [NotificationType.Comment]: 'comment',
  [NotificationType.Report]: 'report',
};

function mapApiToNotification(data: Notification): WebSocketNotification {
  return {
    id: data.id,
    type: typeMap[data.type] || 'comment',
    message: data.message,
    targetId: data.targetId ?? 0,
    targetType: data.targetType ?? '',
    relatedUserId: data.relatedUserId ?? 0,
    relatedUserName: data.relatedUserName ?? '',
    createdAt: new Date(data.createdAt),
    read: data.readStatus === 1,
  };
}

export function WebSocketProvider({ children }: { children: ReactNode }) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [notifications, setNotifications] = useState<WebSocketNotification[]>([]);
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);

  const unreadCount = notifications.filter((n) => !n.read).length;

  const refreshNotifications = useCallback(async () => {
    if (!user) return;
    try {
      const { notificationApi } = await import('@/api/modules/notification.api');
      const data = await notificationApi.getNotifications();
      setNotifications(data.map((item) => mapApiToNotification(item)));
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  }, [user]);

  const markAsRead = useCallback(async (id: number | string) => {
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, read: true } : n)));
    try {
      const { notificationApi } = await import('@/api/modules/notification.api');
      await notificationApi.markAsRead(Number(id));
    } catch (error) {
      console.error('Failed to mark as read:', error);
    }
  }, []);

  const markAllAsRead = useCallback(async () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
    try {
      const { notificationApi } = await import('@/api/modules/notification.api');
      await notificationApi.markAllAsRead();
    } catch (error) {
      console.error('Failed to mark all as read:', error);
    }
  }, []);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  const handleNoToken = useEffectEvent(() => {
    if (!socket) return;
    socket.disconnect();
    setSocket(null);
    setIsConnected(false);
    setNotifications([]);
  });

  useEffect(() => {
    if (!token) {
      handleNoToken();
    }

    const socketInstance = io(import.meta.env.VITE_WS_URL || 'http://localhost:3000', {
      auth: { token },
      transports: ['websocket', 'polling'],
    });

    socketInstance.on('connect', () => {
      setIsConnected(true);
    });

    socketInstance.on('disconnect', () => {
      setIsConnected(false);
    });

    socketInstance.on('notification', (data: unknown) => {
      console.log('Received notification:', data);
      const validData = NotificationSchema.safeParse(data);
      if (!validData.success) {
        console.error('Invalid notification data:', validData.error);
        return;
      }
      setNotifications((prev) => [mapApiToNotification(validData.data), ...prev]);
    });

    setSocket(socketInstance);

    return () => {
      socketInstance.disconnect();
    };
  }, [token]);

  useEffect(() => {
    if (user && isConnected) {
      refreshNotifications();
    }
  }, [user, isConnected, refreshNotifications]);

  return (
    <WebSocketContext.Provider
      value={{
        socket,
        isConnected,
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        clearNotifications,
        refreshNotifications,
      }}>
      {children}
    </WebSocketContext.Provider>
  );
}

export function useWebSocket() {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
}
