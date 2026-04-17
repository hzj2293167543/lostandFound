import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
  useMemo,
  ReactNode,
} from 'react';
import { Manager, Socket } from 'socket.io-client';
import { useAuthStore } from '@/stores/AuthStore';
import { getWsConfig } from '@/api/client';
import { type Notification, NotificationSchema, NotificationType } from '@lostfound/shared';

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
  const token = useAuthStore.use.token();
  const user = useAuthStore.use.user();
  const socketRef = useRef<Socket | null>(null);

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

  useEffect(() => {
    if (!token) return;

    let active = true;
    let currentSocket: Socket | null = null;

    getWsConfig().then((config) => {
      if (!active) return;

      const manager = new Manager(config.wsUrl || '', {
        transports: ['websocket', 'polling'],
      });

      const socket = manager.socket('/notifications', {
        auth: { token },
      });

      currentSocket = socket;
      socketRef.current = socket;

      socket.on('connect', () => active && setIsConnected(true));
      socket.on('disconnect', () => active && setIsConnected(false));
      socket.on('notification', (data: unknown) => {
        if (!active) return;

        const validData = NotificationSchema.safeParse(data);
        if (!validData.success) {
          console.error('Invalid notification data:', validData.error);
          return;
        }
        setNotifications((prev) => [...prev, mapApiToNotification(validData.data)]);
      });

      if (active) {
        setSocket(socket);
      }
    });

    return () => {
      active = false;
      if (currentSocket) {
        currentSocket.removeAllListeners();
        currentSocket.disconnect();
      }
      if (socketRef.current === currentSocket) {
        socketRef.current = null;
      }
    };
  }, [token]);

  useEffect(() => {
    if (user && isConnected) {
      /* eslint-disable-next-line react-hooks/set-state-in-effect */
      refreshNotifications();
    }
  }, [user, isConnected, refreshNotifications]);

  useEffect(() => {
    if (!user || !isConnected) return;

    const fetchNotifications = async () => {
      try {
        const { notificationApi } = await import('@/api/modules/notification.api');
        const data = await notificationApi.getNotifications();
        setNotifications(data.map((item) => mapApiToNotification(item)));
      } catch (error) {
        console.error('Failed to fetch notifications:', error);
      }
    };

    fetchNotifications();
  }, [user, isConnected]);

  const contextValue = useMemo(
    () => ({
      socket,
      isConnected,
      notifications,
      unreadCount,
      markAsRead,
      markAllAsRead,
      clearNotifications,
      refreshNotifications,
    }),
    [
      socket,
      isConnected,
      notifications,
      unreadCount,
      markAsRead,
      markAllAsRead,
      clearNotifications,
      refreshNotifications,
    ]
  );

  return <WebSocketContext.Provider value={contextValue}>{children}</WebSocketContext.Provider>;
}

export function useWebSocket() {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error('useWebSocket must be used within a WebSocketProvider');
  }
  return context;
}
