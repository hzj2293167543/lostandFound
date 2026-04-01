import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';
import { memo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { userApi } from '@/api';
import { formatDate } from '@/utils';
import { PUNISHMENT_TYPE_NAME, TPunishmentType } from '@lostfound/shared';

export default memo(function PersonalInfoDetailPunishments({ userId }: { userId: number }) {
  const { data: punishments, isLoading } = useQuery({
    queryKey: ['user-punishments', userId],
    queryFn: () => userApi.getMyPunishments(),
  });

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex justify-center py-12">
          <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
        </CardContent>
      </Card>
    );
  }

  if (!punishments || punishments.length === 0) {
    return (
      <Card>
        <CardContent className="py-12">
          <p className="text-gray-500 text-center">暂无处罚记录</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {punishments.map((punishment) => (
        <Card key={punishment.id}>
          <CardContent className="pt-4">
            <div className="flex justify-between items-start">
              <div className="space-y-2">
                <Badge variant={punishment.type === 3 ? 'destructive' : 'secondary'}>
                  {PUNISHMENT_TYPE_NAME[punishment.type as TPunishmentType] || '未知'}
                </Badge>
                <p className="text-sm">原因: {punishment.reason || '未说明'}</p>
                <p className="text-xs text-gray-500">
                  处罚时间: {formatDate(punishment.createdAt)}
                </p>
                {punishment.expireAt && (
                  <p className="text-xs text-gray-500">
                    到期时间: {formatDate(punishment.expireAt)}
                  </p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
});
