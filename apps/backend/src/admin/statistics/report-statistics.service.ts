import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report } from '../../reports/entities/report.entity';
import { ReportHandlingStats } from '@lostfound/shared';

@Injectable()
export class ReportStatisticsService {
  constructor(
    @InjectRepository(Report)
    private reportsRepository: Repository<Report>
  ) {}

  async getReportHandlingStats(): Promise<ReportHandlingStats> {
    const [total, pending, approved, rejected, byTypeResults] = await Promise.all([
      this.reportsRepository.count(),
      this.reportsRepository.count({ where: { status: 0 } }),
      this.reportsRepository.count({ where: { status: 1 } }),
      this.reportsRepository.count({ where: { status: 2 } }),
      this.reportsRepository
        .createQueryBuilder('report')
        .select('report.targetType', 'type')
        .addSelect('COUNT(*)', 'count')
        .groupBy('report.targetType')
        .getRawMany(),
    ]);

    const byType: Record<string, number> = {};
    byTypeResults.forEach((r) => {
      byType[String(r.type)] = Number(r.count);
    });

    return { total, pending, approved, rejected, byType };
  }
}
