import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Announcement } from '../announcements/entities/announcement.entity';
import { FoundItem } from '../found-items/entities/found-item.entity';
import { LostItem } from '../lost-items/entities/lost-item.entity';
import { User } from '../users/entities/user.entity';
import {
  FunnelData,
  HourlyDistribution,
  LocationStats,
  MonthlyDistribution,
  ReportHandlingStats,
  UserActivityRanking,
  WeeklyDistribution,
  WordCloudData,
} from '@lostfound/shared';
import {
  ItemStatisticsService,
  UserStatisticsService,
  ReportStatisticsService,
} from './statistics';

@Injectable()
export class StatisticsService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(LostItem)
    private lostItemsRepository: Repository<LostItem>,
    @InjectRepository(FoundItem)
    private foundItemsRepository: Repository<FoundItem>,
    @InjectRepository(Announcement)
    private announcementsRepository: Repository<Announcement>,
    private itemStatisticsService: ItemStatisticsService,
    private userStatisticsService: UserStatisticsService,
    private reportStatisticsService: ReportStatisticsService
  ) {}

  async getOverviewStats(): Promise<{
    lostCount: number;
    foundCount: number;
    userCount: number;
    announcementCount: number;
  }> {
    const [lostCount, foundCount, userCount, announcementCount] = await Promise.all([
      this.lostItemsRepository.count(),
      this.foundItemsRepository.count(),
      this.usersRepository.count(),
      this.announcementsRepository.count(),
    ]);
    return { lostCount, foundCount, userCount, announcementCount };
  }

  getTopLocations(type: 'lost' | 'found', limit: number = 10): Promise<LocationStats[]> {
    return this.itemStatisticsService.getTopLocations(type, limit);
  }

  getHourlyDistribution(type: 'lost' | 'found', days: number = 30): Promise<HourlyDistribution[]> {
    return this.itemStatisticsService.getHourlyDistribution(type, days);
  }

  getWeeklyDistribution(days: number = 30): Promise<WeeklyDistribution[]> {
    return this.itemStatisticsService.getWeeklyDistribution(days);
  }

  getMonthlyDistribution(months: number = 12): Promise<MonthlyDistribution[]> {
    return this.itemStatisticsService.getMonthlyDistribution(months);
  }

  getUserActivityRanking(
    type: 'lost' | 'found' | 'comment',
    limit: number = 10
  ): Promise<UserActivityRanking[]> {
    return this.userStatisticsService.getUserActivityRanking(type, limit);
  }

  getCommentTrend(days: number = 30): Promise<{ date: string; commentCount: number }[]> {
    return this.userStatisticsService.getCommentTrend(days);
  }

  getReportHandlingStats(): Promise<ReportHandlingStats> {
    return this.reportStatisticsService.getReportHandlingStats();
  }

  getFunnelData(): Promise<FunnelData> {
    return this.itemStatisticsService.getFunnelData();
  }

  getWordCloudData(limit: number = 20): Promise<WordCloudData> {
    return this.itemStatisticsService.getWordCloudData(limit);
  }
}
