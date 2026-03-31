import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommentItemType, CommentItemTypeType } from '@/common/constants/constants';
import { Comment } from '../comments/entities/comment.entity';
import { FoundItem } from '../found-items/entities/found-item.entity';
import { LostItem } from '../lost-items/entities/lost-item.entity';

export interface RecentItem {
  id: number;
  title: string;
  time: Date;
}

@Injectable()
export class ItemManagementService {
  constructor(
    @InjectRepository(LostItem)
    private lostItemsRepository: Repository<LostItem>,
    @InjectRepository(FoundItem)
    private foundItemsRepository: Repository<FoundItem>,
    @InjectRepository(Comment)
    private commentsRepository: Repository<Comment>
  ) {}

  async getRecentLostItems(limit: number = 5): Promise<RecentItem[]> {
    const items = await this.lostItemsRepository.find({
      order: { time: 'DESC' },
      take: limit,
      select: ['id', 'title', 'time'],
    });
    return items.map((item) => ({
      id: item.id,
      title: item.title,
      time: item.time,
    }));
  }

  async getRecentFoundItems(limit: number = 5): Promise<RecentItem[]> {
    const items = await this.foundItemsRepository.find({
      order: { time: 'DESC' },
      take: limit,
      select: ['id', 'title', 'time'],
    });
    return items.map((item) => ({
      id: item.id,
      title: item.title,
      time: item.time,
    }));
  }

  getAllLostItems(): Promise<LostItem[]> {
    return this.lostItemsRepository.find({
      relations: ['category'],
    });
  }

  async getLostItemsPaginated(page: number, pageSize: number) {
    const [items, total] = await this.lostItemsRepository.findAndCount({
      relations: ['category'],
      skip: (page - 1) * pageSize,
      take: pageSize,
      order: { time: 'DESC' },
    });
    return {
      items,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  async softDeleteLostItem(id: number): Promise<void> {
    await this.commentsRepository.softDelete({ itemId: id, itemType: CommentItemType.LostItem });
    await this.lostItemsRepository.softDelete(id);
  }

  async restoreLostItem(id: number): Promise<void> {
    await this.lostItemsRepository.restore(id);
    await this.commentsRepository.restore({ itemId: id, itemType: CommentItemType.LostItem });
  }

  getAllFoundItems(): Promise<FoundItem[]> {
    return this.foundItemsRepository.find({
      relations: ['category'],
    });
  }

  async getFoundItemsPaginated(page: number, pageSize: number) {
    const [items, total] = await this.foundItemsRepository.findAndCount({
      relations: ['category'],
      skip: (page - 1) * pageSize,
      take: pageSize,
      order: { time: 'DESC' },
    });
    return {
      items,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  async softDeleteFoundItem(id: number): Promise<void> {
    await this.commentsRepository.softDelete({ itemId: id, itemType: CommentItemType.FoundItem });
    await this.foundItemsRepository.softDelete(id);
  }

  async restoreFoundItem(id: number): Promise<void> {
    await this.foundItemsRepository.restore(id);
    await this.commentsRepository.restore({ itemId: id, itemType: CommentItemType.FoundItem });
  }

  async getLostItemOwnerUserId(itemId: number): Promise<number | null> {
    const item = await this.lostItemsRepository.findOne({
      where: { id: itemId },
      select: ['userId'],
    });
    return item?.userId ?? null;
  }

  async getFoundItemOwnerUserId(itemId: number): Promise<number | null> {
    const item = await this.foundItemsRepository.findOne({
      where: { id: itemId },
      select: ['userId'],
    });
    return item?.userId ?? null;
  }

  async softDeleteItemComments(itemId: number, itemType: CommentItemTypeType): Promise<void> {
    await this.commentsRepository.softDelete({ itemId, itemType });
  }
}
