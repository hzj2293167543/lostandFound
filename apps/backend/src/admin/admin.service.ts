import { Injectable } from '@nestjs/common';
import { ItemManagementService, RecentItem } from './item-management.service';
import { ReportService } from './report.service';

@Injectable()
export class AdminService {
  constructor(
    private itemManagementService: ItemManagementService,
    private reportService: ReportService
  ) {}

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
