import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { LostItem } from '../lost-items/entities/lost-item.entity';
import { FoundItem } from '../found-items/entities/found-item.entity';
import { Announcement } from '../announcements/entities/announcement.entity';
import { ItemManagementService, RecentItem } from './item-management.service';
import { ReportService } from './report.service';

export interface AdminStats {
  lostCount: number;
  foundCount: number;
  userCount: number;
  announcementCount: number;
}

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private itemManagementService: ItemManagementService,
    private reportService: ReportService
  ) {}

  async getStats(): Promise<AdminStats> {
    const [lostCount, foundCount, userCount, announcementCount] = await Promise.all([
      this.usersRepository.manager.getRepository(LostItem).count(),
      this.usersRepository.manager.getRepository(FoundItem).count(),
      this.usersRepository.count(),
      this.usersRepository.manager.getRepository(Announcement).count(),
    ]);
    return { lostCount, foundCount, userCount, announcementCount };
  }

  getAllUsers(): Promise<User[]> {
    return this.usersRepository.find({ where: { role: 0 }, withDeleted: true });
  }

  async getUsersPaginated(page: number, pageSize: number) {
    const [items, total] = await this.usersRepository.findAndCount({
      where: { role: 0 },
      withDeleted: true,
      skip: (page - 1) * pageSize,
      take: pageSize,
      order: { createdAt: 'DESC' },
    });
    return {
      items,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
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

  getRecentLostItems(limit: number = 5): Promise<RecentItem[]> {
    return this.itemManagementService.getRecentLostItems(limit);
  }

  getRecentFoundItems(limit: number = 5): Promise<RecentItem[]> {
    return this.itemManagementService.getRecentFoundItems(limit);
  }

  getAllLostItems() {
    return this.itemManagementService.getAllLostItems();
  }

  getLostItemsPaginated(page: number, pageSize: number) {
    return this.itemManagementService.getLostItemsPaginated(page, pageSize);
  }

  softDeleteLostItem(id: number): Promise<void> {
    return this.itemManagementService.softDeleteLostItem(id);
  }

  restoreLostItem(id: number): Promise<void> {
    return this.itemManagementService.restoreLostItem(id);
  }

  getAllFoundItems() {
    return this.itemManagementService.getAllFoundItems();
  }

  getFoundItemsPaginated(page: number, pageSize: number) {
    return this.itemManagementService.getFoundItemsPaginated(page, pageSize);
  }

  softDeleteFoundItem(id: number): Promise<void> {
    return this.itemManagementService.softDeleteFoundItem(id);
  }

  restoreFoundItem(id: number): Promise<void> {
    return this.itemManagementService.restoreFoundItem(id);
  }

  getReportsPaginated(query: Parameters<typeof this.reportService.getReportsPaginated>[0]) {
    return this.reportService.getReportsPaginated(query);
  }

  handleUserReport(
    reportId: number,
    handlerId: number,
    data: Parameters<typeof this.reportService.handleUserReport>[2]
  ) {
    return this.reportService.handleUserReport(reportId, handlerId, data);
  }

  handleCommentReport(
    reportId: number,
    handlerId: number,
    data: Parameters<typeof this.reportService.handleCommentReport>[2]
  ) {
    return this.reportService.handleCommentReport(reportId, handlerId, data);
  }

  handleLostReport(
    reportId: number,
    handlerId: number,
    data: Parameters<typeof this.reportService.handleLostReport>[2]
  ) {
    return this.reportService.handleLostReport(reportId, handlerId, data);
  }

  handleFoundReport(
    reportId: number,
    handlerId: number,
    data: Parameters<typeof this.reportService.handleFoundReport>[2]
  ) {
    return this.reportService.handleFoundReport(reportId, handlerId, data);
  }

  getReportStats() {
    return this.reportService.getReportStats();
  }

  revokePunishment(punishmentId: number): Promise<void> {
    return this.reportService.revokePunishment(punishmentId);
  }

  getUserPunishments(userId: number) {
    return this.reportService.getUserPunishments(userId);
  }
}
