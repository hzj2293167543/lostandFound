import {
  FoundItemStatus,
  FunnelData,
  HourlyDistribution,
  ItemFunnel,
  LocationStats,
  LostItemStatus,
  MonthlyDistribution,
  WeeklyDistribution,
  WordCloudData,
  WordCloudItem,
} from '@lostfound/shared';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull } from 'typeorm';
import { Jieba } from '@node-rs/jieba';
import { dict } from '@node-rs/jieba/dict';
import { Repository } from 'typeorm';
import { FoundItem } from '../../found-items/entities/found-item.entity';
import { LostItem } from '../../lost-items/entities/lost-item.entity';
import { STOP_WORDS } from './constants';

@Injectable()
export class ItemStatisticsService {
  private jieba: Jieba;

  constructor(
    @InjectRepository(LostItem)
    private lostItemsRepository: Repository<LostItem>,
    @InjectRepository(FoundItem)
    private foundItemsRepository: Repository<FoundItem>
  ) {
    this.jieba = Jieba.withDict(dict);
  }

  async getTopLocations(type: 'lost' | 'found', limit: number = 10): Promise<LocationStats[]> {
    const repo = type === 'lost' ? this.lostItemsRepository : this.foundItemsRepository;
    const results = await repo
      .createQueryBuilder('item')
      .select('item.location', 'location')
      .addSelect('COUNT(*)', 'count')
      .where('item.deletedAt IS NULL')
      .groupBy('item.location')
      .orderBy('count', 'DESC')
      .limit(limit)
      .getRawMany();

    return results.map((r) => ({
      location: r.location,
      count: Number(r.count),
      type,
    }));
  }

  async getHourlyDistribution(
    type: 'lost' | 'found',
    days: number = 30
  ): Promise<HourlyDistribution[]> {
    const repo = type === 'lost' ? this.lostItemsRepository : this.foundItemsRepository;
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const results = await repo
      .createQueryBuilder('item')
      .select('EXTRACT(HOUR FROM item.time)', 'hour')
      .addSelect('COUNT(*)', 'count')
      .where('item.deletedAt IS NULL')
      .andWhere('item.time >= :startDate', { startDate })
      .groupBy('EXTRACT(HOUR FROM item.time)')
      .orderBy('hour', 'ASC')
      .getRawMany();

    return results.map((r) => ({
      hour: Number(r.hour),
      count: Number(r.count),
      type,
    }));
  }

  async getWeeklyDistribution(days: number = 30): Promise<WeeklyDistribution[]> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    const dayNames = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

    const [lostResults, foundResults] = await Promise.all([
      this.lostItemsRepository
        .createQueryBuilder('item')
        .select('EXTRACT(DOW FROM item.time)', 'dayOfWeek')
        .addSelect('COUNT(*)', 'count')
        .where('item.deletedAt IS NULL')
        .andWhere('item.time >= :startDate', { startDate })
        .groupBy('EXTRACT(DOW FROM item.time)')
        .getRawMany(),
      this.foundItemsRepository
        .createQueryBuilder('item')
        .select('EXTRACT(DOW FROM item.time)', 'dayOfWeek')
        .addSelect('COUNT(*)', 'count')
        .where('item.deletedAt IS NULL')
        .andWhere('item.time >= :startDate', { startDate })
        .groupBy('EXTRACT(DOW FROM item.time)')
        .getRawMany(),
    ]);

    const weeklyData: WeeklyDistribution[] = [];
    for (let i = 0; i < 7; i++) {
      const lostCount = lostResults.find((r) => Number(r.dayOfWeek) === i);
      const foundCount = foundResults.find((r) => Number(r.dayOfWeek) === i);
      weeklyData.push({
        dayOfWeek: i,
        dayName: dayNames[i],
        lostCount: lostCount ? Number(lostCount.count) : 0,
        foundCount: foundCount ? Number(foundCount.count) : 0,
      });
    }
    return weeklyData;
  }

  async getMonthlyDistribution(months: number = 12): Promise<MonthlyDistribution[]> {
    const startDate = new Date();
    startDate.setMonth(startDate.getMonth() - months);

    const [lostResults, foundResults] = await Promise.all([
      this.lostItemsRepository
        .createQueryBuilder('item')
        .select("TO_CHAR(item.time, 'YYYY-MM')", 'month')
        .addSelect('COUNT(*)', 'count')
        .where('item.deletedAt IS NULL')
        .andWhere('item.time >= :startDate', { startDate })
        .groupBy("TO_CHAR(item.time, 'YYYY-MM')")
        .orderBy('month', 'ASC')
        .getRawMany(),
      this.foundItemsRepository
        .createQueryBuilder('item')
        .select("TO_CHAR(item.time, 'YYYY-MM')", 'month')
        .addSelect('COUNT(*)', 'count')
        .where('item.deletedAt IS NULL')
        .andWhere('item.time >= :startDate', { startDate })
        .groupBy("TO_CHAR(item.time, 'YYYY-MM')")
        .orderBy('month', 'ASC')
        .getRawMany(),
    ]);

    const monthSet = new Set<string>();
    lostResults.forEach((r) => monthSet.add(r.month));
    foundResults.forEach((r) => monthSet.add(r.month));

    return Array.from(monthSet)
      .sort()
      .map((month) => ({
        month,
        lostCount: Number(lostResults.find((r) => r.month === month)?.count || 0),
        foundCount: Number(foundResults.find((r) => r.month === month)?.count || 0),
        matchedCount: 0,
      }));
  }

  async getFunnelData(): Promise<FunnelData> {
    const [lostResults, foundResults] = await Promise.all([
      this.getLostFunnel(),
      this.getFoundFunnel(),
    ]);
    return { lostFunnel: lostResults, foundFunnel: foundResults };
  }

  private async getLostFunnel(): Promise<ItemFunnel[]> {
    const total = await this.lostItemsRepository.count({ where: { deletedAt: IsNull() } });
    const finding = await this.lostItemsRepository.count({
      where: { status: LostItemStatus.寻找中, deletedAt: IsNull() },
    });
    const found = await this.lostItemsRepository.count({
      where: { status: LostItemStatus.已找到, deletedAt: IsNull() },
    });
    const cancelled = await this.lostItemsRepository.count({
      where: { status: LostItemStatus.已撤销, deletedAt: IsNull() },
    });

    return [
      { type: 'lost', stage: '发布', count: total, percentage: 100 },
      {
        type: 'lost',
        stage: '寻找中',
        count: finding,
        percentage: total > 0 ? Math.round((finding / total) * 100) : 0,
      },
      {
        type: 'lost',
        stage: '已找到',
        count: found,
        percentage: total > 0 ? Math.round((found / total) * 100) : 0,
      },
      {
        type: 'lost',
        stage: '已撤销',
        count: cancelled,
        percentage: total > 0 ? Math.round((cancelled / total) * 100) : 0,
      },
    ];
  }

  private async getFoundFunnel(): Promise<ItemFunnel[]> {
    const total = await this.foundItemsRepository.count({ where: { deletedAt: IsNull() } });
    const recruiting = await this.foundItemsRepository.count({
      where: { status: FoundItemStatus.招领中, deletedAt: IsNull() },
    });
    const returned = await this.foundItemsRepository.count({
      where: { status: FoundItemStatus.已归还, deletedAt: IsNull() },
    });
    const cancelled = await this.foundItemsRepository.count({
      where: { status: FoundItemStatus.已撤销, deletedAt: IsNull() },
    });

    return [
      { type: 'found', stage: '发布', count: total, percentage: 100 },
      {
        type: 'found',
        stage: '招领中',
        count: recruiting,
        percentage: total > 0 ? Math.round((recruiting / total) * 100) : 0,
      },
      {
        type: 'found',
        stage: '已归还',
        count: returned,
        percentage: total > 0 ? Math.round((returned / total) * 100) : 0,
      },
      {
        type: 'found',
        stage: '已撤销',
        count: cancelled,
        percentage: total > 0 ? Math.round((cancelled / total) * 100) : 0,
      },
    ];
  }

  async getWordCloudData(limit: number = 20): Promise<WordCloudData> {
    const [lostWords, foundWords] = await Promise.all([
      this.extractKeywordsFromItems('lost', limit),
      this.extractKeywordsFromItems('found', limit),
    ]);
    return { lostWords, foundWords };
  }

  private async extractKeywordsFromItems(
    type: 'lost' | 'found',
    limit: number
  ): Promise<WordCloudItem[]> {
    const repo = type === 'lost' ? this.lostItemsRepository : this.foundItemsRepository;
    const items = await repo
      .createQueryBuilder('item')
      .select(['item.title', 'item.description'])
      .where('item.deletedAt IS NULL')
      .getRawMany();

    const text = items
      .map((item) => `${item.item_title || ''} ${item.item_description || ''}`)
      .join(' ');

    const wordCounts = this.extractChineseWords(text);
    const sorted = Object.entries(wordCounts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, limit);

    const maxCount = sorted.length > 0 ? sorted[0][1] : 1;
    return sorted.map(([word, count]) => ({
      word,
      count,
      weight: Math.max(0.5, count / maxCount),
    }));
  }

  private extractChineseWords(text: string): Record<string, number> {
    const words = this.jieba.cut(text);
    const wordCounts: Record<string, number> = {};
    for (const w of words) {
      if (w.length >= 2 && !STOP_WORDS.has(w)) {
        wordCounts[w] = (wordCounts[w] || 0) + 1;
      }
    }
    return wordCounts;
  }
}
