import { FoundItem as FoundItemEntity } from './entities/found-item.entity';
import { FoundItem as FoundItemVo } from '@lostfound/shared';

/**
 * 映射 FoundItemEntity 到 FoundItemVo
 * @param item FoundItemEntity 实体对象
 * @returns FoundItemVo 视图对象
 */
export function mapFoundItemToVo(item: FoundItemEntity, commentCount: number): FoundItemVo {
  return {
    id: item.id,
    title: item.title,
    category: item.category,
    time: item.time.toISOString(),
    storageLocation: item.storageLocation,
    contactPhone: item.contactPhone,
    status: item.status,
    description: item.description,
    location: item.location,
    image: item.image,
    user: item.user,
    commentCount,
  };
}
