import { useWebSocket } from '@/contexts/WebSocketContext';
import { useAuthStore } from '@/stores/AuthStore';
import { formatDate, getTargetTab } from '@/utils';
import { AlertTriangle, Heart, MessageCircle } from 'lucide-react';
import { useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

const NotificationIcon = ({ type }: { type: string }) => {
  switch (type) {
    case 'like':
      return <Heart className="w-4 h-4 text-destructive fill-destructive" />;
    case 'comment':
      return <MessageCircle className="w-4 h-4 text-accent" />;
    case 'report':
      return <AlertTriangle className="w-4 h-4 text-warning" />;
    default:
      return null;
  }
};

const NotificationItem = function NotificationItem({
  notification,
  onClick,
  onVisible,
}: {
  notification: {
    id: string | number;
    type: string;
    message: string;
    relatedUserName?: string;
    createdAt: Date;
    read: boolean;
  };
  onClick: () => void;
  onVisible: (id: string) => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry?.isIntersecting && !notification.read) {
          onVisible(String(notification.id));
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, [notification.id, notification.read, onVisible]);

  return (
    <div
      ref={ref}
      onClick={onClick}
      className={`flex items-start gap-3 p-3 hover:bg-muted cursor-pointer transition-colors ${
        notification.read && 'bg-muted/50'
      }`}>
      <div className="mt-1">
        <NotificationIcon type={notification.type} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm text-foreground line-clamp-2">{notification.message}</p>
        {notification.relatedUserName && (
          <p className="text-xs text-muted-foreground mt-1">来自：{notification.relatedUserName}</p>
        )}
        <p className="text-xs text-muted-foreground mt-1">{formatDate(notification.createdAt)}</p>
      </div>
      {!notification.read && <div className="w-2 h-2 rounded-full bg-accent flex-shrink-0 mt-2" />}
    </div>
  );
};

export default function NotificationDropdown() {
  'use no memo';
  const navigate = useNavigate();
  const { notifications, markAsRead, markAllAsRead } = useWebSocket();
  const currentUser = useAuthStore.use.user();

  const unreadNotifications = notifications.filter((n) => !n.read);

  const handleNotificationClick = (notification: {
    id: string | number;
    type: string;
    relatedUserId?: number;
  }) => {
    markAsRead(notification.id);

    const tab = getTargetTab(notification.type);

    switch (notification.type) {
      case 'like':
      case 'comment':
        if (notification.relatedUserId) {
          navigate(`/profile/${currentUser?.id}?tab=${tab}`);
        }
        break;
      case 'report':
        navigate(`/profile?tab=${tab}`);
        break;
    }
  };

  const handleVisible = (id: string) => {
    markAsRead(id);
  };

  return (
    <div className="w-80 max-h-96 overflow-y-auto bg-background rounded-lg border">
      <div className="sticky top-0 border-b px-4 py-3 flex items-center justify-between z-10">
        <h3 className=" font-semibold">通知</h3>
        {unreadNotifications.length > 0 && (
          <button
            onClick={markAllAsRead}
            className="text-xs text-accent-foreground hover:text-accent">
            全部标为已读
          </button>
        )}
      </div>

      {unreadNotifications.length === 0 ? (
        <div className="py-8 text-center text-muted-foreground text-sm">暂无未读通知</div>
      ) : (
        <div>
          {unreadNotifications.map((notification) => (
            <NotificationItem
              key={notification.id}
              notification={notification}
              onClick={() => handleNotificationClick(notification)}
              onVisible={handleVisible}
            />
          ))}
        </div>
      )}
    </div>
  );
}
