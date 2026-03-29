import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, IsNull, MoreThanOrEqual, Repository } from 'typeorm';
import { Report } from './entities/report.entity';
import { ReportReason } from './entities/report-reason.entity';
import { CreateReportDto, ReportStatus, TReportTargetType } from '@lostfound/shared';
@Injectable()
export class ReportsService {
  constructor(
    @InjectRepository(Report)
    private reportRepository: Repository<Report>,
    @InjectRepository(ReportReason)
    private reportReasonRepository: Repository<ReportReason>
  ) {}

  async create(reporterId: number, dto: CreateReportDto): Promise<Report> {
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

  async getReportsByTarget(targetType: TReportTargetType, targetId: number): Promise<Report[]> {
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
}
