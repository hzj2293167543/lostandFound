import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CommentItemType } from '@/common/constants/constants';
import {
  HandleReportDto,
  ReportPaginationParams,
  ReportStatus,
  ReportTargetType,
} from '@lostfound/shared';
import { Comment } from '../comments/entities/comment.entity';
import { FoundItem } from '../found-items/entities/found-item.entity';
import { LostItem } from '../lost-items/entities/lost-item.entity';
import { Punishment, PunishmentType } from '../reports/entities/punishment.entity';
import { ReportReason } from '../reports/entities/report-reason.entity';
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
    @InjectRepository(ReportReason)
    private reportReasonsRepository: Repository<ReportReason>,
    @InjectRepository(Punishment)
    private punishmentsRepository: Repository<Punishment>,
    @InjectRepository(Comment)
    private commentsRepository: Repository<Comment>,
    private itemManagementService: ItemManagementService
  ) {}

  async getReportsPaginated(query: ReportPaginationParams) {
    const { page, pageSize, status, targetType } = query;

    const where: Record<string, unknown> | undefined = {};
    if (status !== undefined) {
      where.status = status;
    }
    if (targetType !== undefined) {
      where.targetType = targetType;
    }
    const [items, total] = await this.reportsRepository.findAndCount({
      where: Object.keys(where).length > 0 ? where : undefined,
      relations: ['reporter', 'reason', 'handler'],
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

  async getReportStats() {
    const [pending, approved, rejected] = await Promise.all([
      this.reportsRepository.count({ where: { status: ReportStatus.Pending } }),
      this.reportsRepository.count({ where: { status: ReportStatus.Approved } }),
      this.reportsRepository.count({ where: { status: ReportStatus.Rejected } }),
    ]);
    return { pending, approved, rejected, total: pending + approved + rejected };
  }

  async handleUserReport(
    reportId: number,
    handlerId: number,
    data: HandleReportDto
  ): Promise<Report> {
    const { status, handlingResult, punishmentType, punishmentDurationDays } = data;
    const report = await this.reportsRepository.findOne({
      where: { id: reportId },
      relations: ['reporter', 'reason'],
    });

    if (!report) {
      throw new Error('Report not found');
    }

    await this.reportsRepository.update(reportId, {
      status,
      handlerId,
      handledAt: new Date(),
      handlingResult,
    });

    if (status === ReportStatus.Approved && report.targetType === ReportTargetType.User) {
      await this.createPunishment(
        report.targetId,
        punishmentType,
        punishmentDurationDays,
        report,
        handlerId
      );
    }

    return this.reportsRepository.findOne({
      where: { id: reportId },
      relations: ['reporter', 'reason', 'handler'],
    });
  }

  async handleCommentReport(
    reportId: number,
    handlerId: number,
    data: HandleReportDto
  ): Promise<Report> {
    const { status, handlingResult, punishmentType, punishmentDurationDays } = data;
    const report = await this.reportsRepository.findOne({
      where: { id: reportId },
      relations: ['reporter', 'reason'],
    });

    if (!report) {
      throw new Error('Report not found');
    }

    await this.reportsRepository.update(reportId, {
      status,
      handlerId,
      handledAt: new Date(),
      handlingResult,
    });

    if (status === ReportStatus.Approved && report.targetType === ReportTargetType.Comment) {
      const comment = await this.commentsRepository.findOne({
        where: { id: report.targetId },
        select: ['userId'],
      });
      const targetUserId = comment?.userId ?? null;
      await this.commentsRepository.softDelete(report.targetId);

      if (targetUserId && (punishmentType !== undefined || punishmentDurationDays !== undefined)) {
        await this.createPunishment(
          targetUserId,
          punishmentType,
          punishmentDurationDays,
          report,
          handlerId
        );
      }
    }

    return this.reportsRepository.findOne({
      where: { id: reportId },
      relations: ['reporter', 'reason', 'handler'],
    });
  }

  async handleLostReport(
    reportId: number,
    handlerId: number,
    data: HandleReportDto
  ): Promise<Report> {
    const { status, handlingResult, punishmentType, punishmentDurationDays } = data;
    const report = await this.reportsRepository.findOne({
      where: { id: reportId },
      relations: ['reporter', 'reason'],
    });

    if (!report) {
      throw new Error('Report not found');
    }

    await this.reportsRepository.update(reportId, {
      status,
      handlerId,
      handledAt: new Date(),
      handlingResult,
    });

    if (status === ReportStatus.Approved && report.targetType === ReportTargetType.LostItem) {
      const targetUserId = await this.itemManagementService.getLostItemOwnerUserId(report.targetId);
      await this.itemManagementService.softDeleteItemComments(
        report.targetId,
        CommentItemType.LostItem
      );
      await this.reportsRepository.manager.getRepository(LostItem).softDelete(report.targetId);

      if (targetUserId && (punishmentType !== undefined || punishmentDurationDays !== undefined)) {
        await this.createPunishment(
          targetUserId,
          punishmentType,
          punishmentDurationDays,
          report,
          handlerId
        );
      }
    }

    return this.reportsRepository.findOne({
      where: { id: reportId },
      relations: ['reporter', 'reason', 'handler'],
    });
  }

  async handleFoundReport(
    reportId: number,
    handlerId: number,
    data: HandleReportDto
  ): Promise<Report> {
    const { status, handlingResult, punishmentType, punishmentDurationDays } = data;
    const report = await this.reportsRepository.findOne({
      where: { id: reportId },
      relations: ['reporter', 'reason'],
    });

    if (!report) {
      throw new Error('Report not found');
    }

    await this.reportsRepository.update(reportId, {
      status,
      handlerId,
      handledAt: new Date(),
      handlingResult,
    });

    if (status === ReportStatus.Approved && report.targetType === ReportTargetType.FoundItem) {
      const targetUserId = await this.itemManagementService.getFoundItemOwnerUserId(
        report.targetId
      );
      await this.itemManagementService.softDeleteItemComments(
        report.targetId,
        CommentItemType.FoundItem
      );
      await this.reportsRepository.manager.getRepository(FoundItem).softDelete(report.targetId);

      if (targetUserId && (punishmentType !== undefined || punishmentDurationDays !== undefined)) {
        await this.createPunishment(
          targetUserId,
          punishmentType,
          punishmentDurationDays,
          report,
          handlerId
        );
      }
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
  }

  async revokePunishment(punishmentId: number): Promise<void> {
    const punishment = await this.punishmentsRepository.findOne({
      where: { id: punishmentId },
    });

    if (!punishment) {
      throw new Error('Punishment not found');
    }

    if (punishment.type === PunishmentType.Ban) {
      await this.usersRepository.update(punishment.userId, { status: 1 });
    }

    await this.punishmentsRepository.delete(punishmentId);
  }

  getUserPunishments(userId: number) {
    return this.punishmentsRepository.find({
      where: { userId },
      order: { createdAt: 'DESC' },
    });
  }
}
