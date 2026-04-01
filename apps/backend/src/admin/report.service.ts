import { CommentItemType } from '@/common/constants/constants';
import {
  HandleReportDto,
  NotificationType,
  ReportPaginationParams,
  ReportStatus,
  ReportTargetType,
  TReportTargetType,
} from '@lostfound/shared';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from '../comments/entities/comment.entity';
import { FoundItem } from '../found-items/entities/found-item.entity';
import { LostItem } from '../lost-items/entities/lost-item.entity';
import { NotificationGateway } from '../notifications/notification.gateway';
import { Punishment, PunishmentType } from '../reports/entities/punishment.entity';
import { Report } from '../reports/entities/report.entity';
import { User } from '../users/entities/user.entity';
import { ItemManagementService } from './item-management.service';

@Injectable()
export class ReportService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Report)
    private reportsRepository: Repository<Report>,
    @InjectRepository(Punishment)
    private punishmentsRepository: Repository<Punishment>,
    @InjectRepository(Comment)
    private commentsRepository: Repository<Comment>,
    private itemManagementService: ItemManagementService,
    private notificationGateway: NotificationGateway
  ) {}

  async getReportsPaginated(query: ReportPaginationParams) {
    const { page, pageSize, status, targetType } = query;
    const where: Record<string, unknown> = {};
    if (status !== undefined) where.status = status;
    if (targetType !== undefined) where.targetType = targetType;

    const [items, total] = await this.reportsRepository.findAndCount({
      where: Object.keys(where).length > 0 ? where : undefined,
      relations: ['reporter', 'reason', 'handler'],
      skip: (page - 1) * pageSize,
      take: pageSize,
      order: { createdAt: 'DESC' },
    });
    return { items, total, page, pageSize, totalPages: Math.ceil(total / pageSize) };
  }

  async getReportStats() {
    const [pending, approved, rejected] = await Promise.all([
      this.reportsRepository.count({ where: { status: ReportStatus.Pending } }),
      this.reportsRepository.count({ where: { status: ReportStatus.Approved } }),
      this.reportsRepository.count({ where: { status: ReportStatus.Rejected } }),
    ]);
    return { pending, approved, rejected, total: pending + approved + rejected };
  }

  handleUserReport(reportId: number, handlerId: number, data: HandleReportDto): Promise<Report> {
    return this.handleReport(reportId, handlerId, data, ReportTargetType.User, {
      onApproved: async (targetId, punishmentType, durationDays, report) => {
        await this.createPunishment(targetId, punishmentType, durationDays, report, handlerId);
      },
    });
  }

  handleCommentReport(reportId: number, handlerId: number, data: HandleReportDto): Promise<Report> {
    return this.handleReport(reportId, handlerId, data, ReportTargetType.Comment, {
      onApproved: async (targetId, punishmentType, durationDays, report) => {
        const comment = await this.commentsRepository.findOne({
          where: { id: targetId },
          select: ['userId'],
        });
        const targetUserId = comment?.userId ?? null;
        await this.commentsRepository.softDelete(targetId);
        if (targetUserId && (punishmentType !== undefined || durationDays !== undefined)) {
          await this.createPunishment(
            targetUserId,
            punishmentType,
            durationDays,
            report,
            handlerId
          );
        }
      },
    });
  }

  handleLostReport(reportId: number, handlerId: number, data: HandleReportDto): Promise<Report> {
    return this.handleReport(reportId, handlerId, data, ReportTargetType.LostItem, {
      onApproved: async (targetId, punishmentType, durationDays, report) => {
        const targetUserId = await this.itemManagementService.getLostItemOwnerUserId(targetId);
        await this.itemManagementService.softDeleteItemComments(targetId, CommentItemType.LostItem);
        await this.reportsRepository.manager.getRepository(LostItem).softDelete(targetId);
        if (targetUserId && (punishmentType !== undefined || durationDays !== undefined)) {
          await this.createPunishment(
            targetUserId,
            punishmentType,
            durationDays,
            report,
            handlerId
          );
        }
      },
    });
  }

  handleFoundReport(reportId: number, handlerId: number, data: HandleReportDto): Promise<Report> {
    return this.handleReport(reportId, handlerId, data, ReportTargetType.FoundItem, {
      onApproved: async (targetId, punishmentType, durationDays, report) => {
        const targetUserId = await this.itemManagementService.getFoundItemOwnerUserId(targetId);
        await this.itemManagementService.softDeleteItemComments(
          targetId,
          CommentItemType.FoundItem
        );
        await this.reportsRepository.manager.getRepository(FoundItem).softDelete(targetId);
        if (targetUserId && (punishmentType !== undefined || durationDays !== undefined)) {
          await this.createPunishment(
            targetUserId,
            punishmentType,
            durationDays,
            report,
            handlerId
          );
        }
      },
    });
  }

  private async handleReport(
    reportId: number,
    handlerId: number,
    data: HandleReportDto,
    expectedTargetType: TReportTargetType,
    options: {
      onApproved: (
        targetId: number,
        punishmentType: PunishmentType | undefined,
        durationDays: number | undefined,
        report: Report
      ) => Promise<void>;
    }
  ): Promise<Report> {
    const { status, handlingResult, punishmentType, punishmentDurationDays } = data;
    const report = await this.reportsRepository.findOne({
      where: { id: reportId },
      relations: ['reporter', 'reason'],
    });

    if (!report) throw new Error('Report not found');

    await this.reportsRepository.update(reportId, {
      status,
      handlerId,
      handledAt: new Date(),
      handlingResult,
    });

    if (status === ReportStatus.Approved && report.targetType === expectedTargetType) {
      await options.onApproved(report.targetId, punishmentType, punishmentDurationDays, report);
    }

    return this.reportsRepository.findOne({
      where: { id: reportId },
      relations: ['reporter', 'reason', 'handler'],
    });
  }

  private async createPunishment(
    userId: number,
    punishmentType: PunishmentType | undefined,
    punishmentDurationDays: number | undefined,
    report: Report,
    handlerId?: number
  ): Promise<void> {
    const punishment = this.punishmentsRepository.create({
      userId,
      type: punishmentType ?? PunishmentType.Ban,
      durationDays: punishmentDurationDays ?? 0,
      expireAt:
        punishmentDurationDays && punishmentDurationDays > 0
          ? new Date(Date.now() + punishmentDurationDays * 24 * 60 * 60 * 1000)
          : null,
      reason: report.reason?.reasonText || report.reasonDesc || '',
      handlerId,
      reportId: report.id,
    });
    await this.punishmentsRepository.save(punishment);

    if (punishmentType === PunishmentType.Ban || !punishmentType) {
      await this.usersRepository.update(userId, { status: 0 });
    }

    this.notificationGateway.sendNotificationToUser({
      userId,
      type: NotificationType.Report,
      message: `你的账号因违规被管理员处罚：${report.reason?.reasonText || report.reasonDesc || '违反平台规定'}`,
      targetId: report.id,
      targetType: 'report',
    });
  }

  async revokePunishment(punishmentId: number): Promise<void> {
    const punishment = await this.punishmentsRepository.findOne({ where: { id: punishmentId } });
    if (!punishment) throw new Error('Punishment not found');
    if (punishment.type === PunishmentType.Ban)
      await this.usersRepository.update(punishment.userId, { status: 1 });
    await this.punishmentsRepository.delete(punishmentId);
  }

  getUserPunishments(userId: number) {
    return this.punishmentsRepository.find({ where: { userId }, order: { createdAt: 'DESC' } });
  }
}
