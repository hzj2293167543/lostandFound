import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Not, IsNull, In } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Category } from '../categories/entities/category.entity';
import { Announcement } from '../announcements/entities/announcement.entity';
import { LostItem } from '../lost-items/entities/lost-item.entity';
import { FoundItem } from '../found-items/entities/found-item.entity';
import { Comment } from '../comments/entities/comment.entity';
import {
  AnnouncementCreateDto,
  Announcement as AnnouncementDto,
  AnnouncementEditDto,
} from '@lostfound/shared';
import { CommentItemType } from '@/common/constants/constants';
export interface AdminStats {
  lostCount: number;
  foundCount: number;
  userCount: number;
  announcementCount: number;
}

export interface RecentItem {
  id: number;
  title: string;
  time: Date;
}

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
    @InjectRepository(Announcement)
    private announcementsRepository: Repository<Announcement>,
    @InjectRepository(LostItem)
    private lostItemsRepository: Repository<LostItem>,
    @InjectRepository(FoundItem)
    private foundItemsRepository: Repository<FoundItem>,
    @InjectRepository(Comment)
    private commentsRepository: Repository<Comment>
  ) {}

  async getStats(): Promise<AdminStats> {
    const [lostCount, foundCount, userCount, announcementCount] = await Promise.all([
      this.lostItemsRepository.count(),
      this.foundItemsRepository.count(),
      this.usersRepository.count(),
      this.announcementsRepository.count(),
    ]);
    return { lostCount, foundCount, userCount, announcementCount };
  }

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

  getAllUsers(): Promise<User[]> {
    return this.usersRepository.find({ where: { role: 0 }, withDeleted: true });
  }

  async updateUserStatus(userId: number, status: number): Promise<User> {
    await this.usersRepository.update(userId, { status });
    return this.usersRepository.findOne({ where: { id: userId } });
  }

  async softDeleteUser(id: number): Promise<void> {
    await this.usersRepository.softDelete(id);
  }

  async restoreUser(id: number): Promise<void> {
    await this.usersRepository.restore(id);
  }

  async getAllLostItems(): Promise<LostItem[]> {
    return this.lostItemsRepository.find({
      relations: ['category'],
    });
  }

  async softDeleteLostItem(id: number): Promise<void> {
    await this.commentsRepository.softDelete({ itemId: id, itemType: CommentItemType.LostItem });
    await this.lostItemsRepository.softDelete(id);
  }

  async restoreLostItem(id: number): Promise<void> {
    await this.lostItemsRepository.restore(id);
    await this.commentsRepository.restore({ itemId: id, itemType: CommentItemType.LostItem });
  }

  async getAllFoundItems(): Promise<FoundItem[]> {
    return this.foundItemsRepository.find({
      relations: ['category'],
    });
  }

  async softDeleteFoundItem(id: number): Promise<void> {
    await this.commentsRepository.softDelete({ itemId: id, itemType: CommentItemType.FoundItem });
    await this.foundItemsRepository.softDelete(id);
  }

  async restoreFoundItem(id: number): Promise<void> {
    await this.foundItemsRepository.restore(id);
    await this.commentsRepository.restore({ itemId: id, itemType: CommentItemType.FoundItem });
  }

  async getAllCategories(): Promise<Category[]> {
    return this.categoriesRepository.find();
  }

  async createCategory(name: string): Promise<Category> {
    const category = this.categoriesRepository.create({ name });
    return this.categoriesRepository.save(category);
  }

  async updateCategory(id: number, name: string): Promise<Category> {
    await this.categoriesRepository.update(id, { name });
    return this.categoriesRepository.findOne({ where: { id } });
  }

  async deleteCategory(id: number): Promise<{ success: boolean; message: string }> {
    const categoryToDelete = await this.categoriesRepository.findOne({ where: { id } });
    if (!categoryToDelete) {
      return { success: false, message: '分类不存在' };
    }

    if (categoryToDelete.defaultSince !== null) {
      return { success: false, message: '系统默认分类不能被删除' };
    }

    const defaultCategory = await this.categoriesRepository.findOne({
      where: { defaultSince: Not(IsNull()) },
    });

    if (!defaultCategory) {
      return { success: false, message: '系统中没有默认分类，无法删除' };
    }

    const itemsWithCategory = await Promise.all([
      this.lostItemsRepository.count({ where: { categoryId: id } }),
      this.foundItemsRepository.count({ where: { categoryId: id } }),
    ]);

    const totalItems = itemsWithCategory[0] + itemsWithCategory[1];

    if (totalItems > 0) {
      await Promise.all([
        this.lostItemsRepository.update({ categoryId: id }, { categoryId: defaultCategory.id }),
        this.foundItemsRepository.update({ categoryId: id }, { categoryId: defaultCategory.id }),
      ]);
    }

    await this.categoriesRepository.delete(id);
    return {
      success: true,
      message:
        totalItems > 0
          ? `分类删除成功，已将 ${totalItems} 个物品迁移到分类「${defaultCategory.name}」`
          : '分类删除成功',
    };
  }

  getAllAnnouncements(): Promise<Announcement[]> {
    return this.announcementsRepository.find({
      order: { time: 'DESC' },
    });
  }

  createAnnouncement(data: Partial<AnnouncementCreateDto>): Promise<Announcement> {
    const { author, ...rest } = data;
    const announcement = this.announcementsRepository.create({
      ...rest,
      authorId: author,
      time: new Date(),
    });
    return this.announcementsRepository.save(announcement);
  }

  async updateAnnouncement(id: number, data: Partial<AnnouncementEditDto>): Promise<Announcement> {
    const exists = await this.announcementsRepository.exists({ where: { id } });
    if (!exists) {
      throw new Error('Announcement not found');
    }
    const { author, ...rest } = data;
    const announcement = new Announcement();
    Object.assign(announcement, rest);
    announcement.authorId = author;
    announcement.time = new Date();
    await this.announcementsRepository.update(id, announcement);
    return this.announcementsRepository.findOne({ where: { id } });
  }

  async deleteAnnouncement(id: number): Promise<void> {
    await this.announcementsRepository.delete(id);
  }
}
