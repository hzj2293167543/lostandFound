import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, MoreThan, MoreThanOrEqual, Repository } from 'typeorm';
import { Report } from './entities/report.entity';
import { ReportReason } from './entities/report-reason.entity';
import {
  CreateUserReportDto,
  CreateCommentReportDto,
  CreateLostReportDto,
  CreateFoundReportDto,
  ReportStatus,
  TReportTargetType,
} from '@lostfound/shared';
import { Punishment, PunishmentType } from './entities/punishment.entity';

type CreateReportDto =
  | CreateUserReportDto
  | CreateCommentReportDto
  | CreateLostReportDto
  | CreateFoundReportDto;

@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report)
    private reportRepository: Repository<Report>,
    @InjectRepository(ReportReason)
    private reportReasonRepository: Repository<ReportReason>,
    @InjectRepository(Punishment)
    private punishmentRepository: Repository<Punishment>
  ) {}

  create(
    reporterId: number,
    dto: CreateReportDto & { targetType: TReportTargetType }
  ): Promise<Report> {
    const report = this.reportRepository.create({
      ...dto,
      reporterId,
      status: ReportStatus.Pending,
    });
    return this.reportRepository.save(report);
  }

  getReportReasons(targetType?: TReportTargetType): Promise<ReportReason[]> {
    const where = [
      { targetType: IsNull(), isActive: 1 },
      { targetType, isActive: 1 },
    ];
    return this.reportReasonRepository.find({
      where,
      order: { sortOrder: 'ASC' },
    });
  }

  getReportsByTarget(targetType: TReportTargetType, targetId: number): Promise<Report[]> {
    return this.reportRepository.find({
      where: { targetType, targetId },
      relations: ['reporter', 'reason'],
      order: { createdAt: 'DESC' },
    });
  }

  async hasExistingReport(
    reporterId: number,
    targetType: TReportTargetType,
    targetId: number
  ): Promise<boolean> {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const existing = await this.reportRepository.findOne({
      where: {
        reporterId,
        targetType,
        targetId,
        status: ReportStatus.Pending,
        createdAt: MoreThanOrEqual(thirtyDaysAgo),
      },
    });
    return !!existing;
  }

  getActiveBan(userId: number): Promise<Punishment | null> {
    return this.punishmentRepository.findOne({
      where: [
        {
          userId,
          type: PunishmentType.Ban,
          expireAt: IsNull(),
        },
        {
          userId,
          type: PunishmentType.Ban,
          expireAt: MoreThan(new Date()),
        },
      ],
    });
  }
}
