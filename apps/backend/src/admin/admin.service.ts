import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Category } from '../categories/entities/category.entity';
import { Announcement } from '../announcements/entities/announcement.entity';
import { LostItem } from '../lost-items/entities/lost-item.entity';
import { FoundItem } from '../found-items/entities/found-item.entity';
import {
  AnnouncementCreateDto,
  Announcement as AnnouncementDto,
  AnnouncementEditDto,
} from '@lostfound/shared';
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
    private foundItemsRepository: Repository<FoundItem>
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
    return this.usersRepository.find({ where: { role: 0 } });
  }

  async updateUserStatus(userId: number, status: number): Promise<User> {
    await this.usersRepository.update(userId, { status });
    return this.usersRepository.findOne({ where: { id: userId } });
  }

  async getAllLostItems(): Promise<LostItem[]> {
    return this.lostItemsRepository.find({
      relations: ['category'],
    });
  }

  async deleteLostItem(id: number): Promise<void> {
    await this.lostItemsRepository.delete(id);
  }

  async getAllFoundItems(): Promise<FoundItem[]> {
    return this.foundItemsRepository.find({
      relations: ['category'],
    });
  }

  async deleteFoundItem(id: number): Promise<void> {
    await this.foundItemsRepository.delete(id);
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

  async deleteCategory(id: number): Promise<void> {
    await this.categoriesRepository.delete(id);
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
