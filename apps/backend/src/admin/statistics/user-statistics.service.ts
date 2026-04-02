import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from '../../comments/entities/comment.entity';
import { FoundItem } from '../../found-items/entities/found-item.entity';
import { LostItem } from '../../lost-items/entities/lost-item.entity';
import { UserActivityRanking } from '@lostfound/shared';

@Injectable()
export class UserStatisticsService {
  constructor(
    @InjectRepository(LostItem)
    private lostItemsRepository: Repository<LostItem>,
    @InjectRepository(FoundItem)
    private foundItemsRepository: Repository<FoundItem>,
    @InjectRepository(Comment)
    private commentsRepository: Repository<Comment>
  ) {}

  async getUserActivityRanking(
    type: 'lost' | 'found' | 'comment',
    limit: number = 10
  ): Promise<UserActivityRanking[]> {
    const rawResults = await this.queryUserActivityByType(type, limit);
    return rawResults.map((r) => ({
      userId: r.userId,
      userName: r.userName || '未知用户',
      postCount: Number(r.postCount),
      type,
    }));
  }

  private queryUserActivityByType(
    type: 'lost' | 'found' | 'comment',
    limit: number
  ): Promise<{ userId: number; userName: string; postCount: number }[]> {
    if (type === 'lost') {
      return this.lostItemsRepository
        .createQueryBuilder('item')
        .select('item.user_id', 'userId')
        .addSelect('MAX(user.name)', 'userName')
        .addSelect('COUNT(*)', 'postCount')
        .leftJoin('item.user', 'user')
        .where('item.deletedAt IS NULL')
        .groupBy('item.user_id')
        .orderBy('postCount', 'DESC')
        .limit(limit)
        .getRawMany();
    }
    if (type === 'found') {
      return this.foundItemsRepository
        .createQueryBuilder('item')
        .select('item.user_id', 'userId')
        .addSelect('MAX(user.name)', 'userName')
        .addSelect('COUNT(*)', 'postCount')
        .leftJoin('item.user', 'user')
        .where('item.deletedAt IS NULL')
        .groupBy('item.user_id')
        .orderBy('postCount', 'DESC')
        .limit(limit)
        .getRawMany();
    }
    return this.commentsRepository
      .createQueryBuilder('comment')
      .select('comment.user_id', 'userId')
      .addSelect('MAX(user.name)', 'userName')
      .addSelect('COUNT(*)', 'postCount')
      .leftJoin('comment.user', 'user')
      .where('comment.deletedAt IS NULL')
      .groupBy('comment.user_id')
      .orderBy('postCount', 'DESC')
      .limit(limit)
      .getRawMany();
  }

  async getCommentTrend(days: number = 30): Promise<{ date: string; commentCount: number }[]> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const results = await this.commentsRepository
      .createQueryBuilder('comment')
      .select('DATE(comment.time)', 'date')
      .addSelect('COUNT(*)', 'commentCount')
      .where('comment.deletedAt IS NULL')
      .andWhere('comment.time >= :startDate', { startDate })
      .groupBy('DATE(comment.time)')
      .orderBy('date', 'ASC')
      .getRawMany();

    return results.map((r) => ({
      date: r.date,
      commentCount: Number(r.commentCount),
    }));
  }
}
