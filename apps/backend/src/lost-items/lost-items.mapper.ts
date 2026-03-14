import { LostItem as LostItemVo } from '@lostfound/shared';
import { LostItem as LostItemEntity } from './entities/lost-item.entity';

export function mapLostItemToVo(item: LostItemEntity, commentCount: number): LostItemVo {
  return {
    id: item.id,
    title: item.title,
    category: {
      id: item.category.id,
      name: item.category.name,
    },
    description: item.description,
    time: item.time.toISOString(),
    location: item.location,
    status: item.status,
    image: item.image,
    commentCount,
    user: {
      id: item.user.id,
      name: item.user.name,
      avatar: item.user.avatar,
    },
  };
}
