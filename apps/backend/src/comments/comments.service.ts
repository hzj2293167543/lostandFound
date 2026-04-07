import { CommentItemTypeType } from '@/common/constants/constants';
import { CommentCreateDto, CommentItem, PageResponse } from '@lostfound/shared';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { NotificationGateway } from '../notifications/notification.gateway';
import { NotificationType } from '@lostfound/shared';
import { mapCommentToVo } from './comments.mapper';
import { Comment } from './entities/comment.entity';
import { CommentLike } from './entities/comment_likes.entity';
import { User } from '../users/entities/user.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentsRepository: Repository<Comment>,
    @InjectRepository(CommentLike)
    private commentLikeRepository: Repository<CommentLike>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private notificationGateway: NotificationGateway
  ) {}

  async findByItem(itemId: number, itemType: number, userId?: number): Promise<CommentItem[]> {
    const items = await this.commentsRepository.find({
      where: { itemId, itemType },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
    return this.enrichComments(items, userId);
  }

  async findByItemPaginated(
    itemId: number,
    itemType: number,
    userId?: number,
    page: number = 1,
    limit: number = 10
  ): Promise<PageResponse<CommentItem>> {
    const skip = (page - 1) * limit;
    const [items, total] = await this.commentsRepository.findAndCount({
      where: { itemId, itemType, rootId: IsNull() },
      relations: ['user'],
      order: { createdAt: 'DESC' },
      skip,
      take: limit,
    });
    return this.buildPageResponse(
      await this.enrichCommentsWithChildrenCount(items, userId),
      total,
      page,
      limit
    );
  }

  async findChildrenPaginated(
    rootId: number,
    userId?: number,
    page: number = 1,
    limit: number = 10
  ): Promise<PageResponse<CommentItem>> {
    const skip = (page - 1) * limit;
    const [items, total] = await this.commentsRepository.findAndCount({
      where: { rootId },
      relations: ['user', 'parent', 'parent.user'],
      order: { createdAt: 'ASC' },
      skip,
      take: limit,
    });
    return this.buildPageResponse(await this.enrichComments(items, userId), total, page, limit);
  }

  async findByUser(
    userId: number,
    page: number = 1,
    limit: number = 10
  ): Promise<PageResponse<CommentItem>> {
    const skip = (page - 1) * limit;
    const [items, total] = await this.commentsRepository.findAndCount({
      where: { userId },
      relations: ['user'],
      order: { createdAt: 'DESC' },
      skip,
      take: limit,
    });
    return this.buildPageResponse(await this.enrichComments(items, userId), total, page, limit);
  }

  async findRepliesToMe(
    userId: number,
    page: number = 1,
    limit: number = 10
  ): Promise<PageResponse<CommentItem>> {
    const skip = (page - 1) * limit;
    const [items, total] = await this.commentsRepository
      .createQueryBuilder('comment')
      .leftJoinAndSelect('comment.user', 'user')
      .leftJoinAndSelect('comment.parent', 'parent')
      .leftJoinAndSelect('parent.user', 'parentUser')
      .where('parent.userId = :userId', { userId })
      .andWhere('comment.userId != :userId', { userId })
      .orderBy('comment.createdAt', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();
    return this.buildPageResponse(await this.enrichComments(items, userId), total, page, limit);
  }

  async getItemCommentCountMapByType(
    itemIds: number[],
    itemType: CommentItemTypeType
  ): Promise<Map<number, number>> {
    if (itemIds.length === 0) return new Map();
    const counts = await this.commentsRepository
      .createQueryBuilder('comment')
      .select('comment.itemId', 'itemId')
      .addSelect('COUNT(*)', 'count')
      .where('comment.itemType = :itemType', { itemType })
      .andWhere('comment.itemId IN (:...ids)', { ids: itemIds })
      .groupBy('comment.itemId')
      .getRawMany();
    return new Map(counts.map((entry) => [Number(entry.itemId), Number(entry.count)]));
  }

  async likeComment(id: number, userId: number, isLike: boolean): Promise<void> {
    if (isLike) {
      if (await this.findLiked(id, userId)) throw new Error('已点赞');
      await this.commentLikeRepository.insert({ commentId: id, userId, likeTime: new Date() });
      const [comment, liker] = await Promise.all([
        this.commentsRepository.findOne({ where: { id }, relations: ['user'] }),
        this.usersRepository.findOne({ where: { id: userId } }),
      ]);
      if (comment && comment.userId !== userId) {
        this.notificationGateway.sendNotificationToUser({
          userId: comment.userId,
          type: NotificationType.Like,
          message: `${liker?.name || '有人'}点赞了你的评论`,
          targetId: id,
          targetType: 'comment',
          relatedUserId: userId,
          relatedUserName: liker?.name,
        });
      }
    } else {
      await this.commentLikeRepository.delete({ commentId: id, userId });
    }
  }

  findLikes(id: number): Promise<number> {
    return this.commentLikeRepository.count({ where: { commentId: id } });
  }

  findLiked(id: number, userId: number): Promise<boolean> {
    return this.commentLikeRepository.exists({ where: { commentId: id, userId } });
  }

  findTop(count?: number): Promise<Comment[]> {
    return this.commentsRepository.find({
      relations: ['user'],
      order: { createdAt: 'DESC' },
      take: count === undefined ? undefined : count,
    });
  }

  async create(data: CommentCreateDto & { userId: number }): Promise<Comment> {
    let rootId: number | null = null;
    let notifyUserId: number | null = null;
    if (data.parentId !== null && data.parentId !== undefined) {
      const parent = await this.commentsRepository.findOne({
        where: { id: data.parentId },
        select: ['rootId', 'userId'],
      });
      rootId = parent?.rootId ?? data.parentId;
      if (parent && parent.userId !== data.userId) {
        notifyUserId = parent.userId;
      }
    }
    const comment = this.commentsRepository.create({ ...data, rootId, time: new Date() });
    const savedComment = await this.commentsRepository.save(comment);
    if (notifyUserId) {
      const commenter = await this.usersRepository.findOne({ where: { id: data.userId } });
      this.notificationGateway.sendNotificationToUser({
        userId: notifyUserId,
        type: NotificationType.Comment,
        message: `${commenter?.name || '有人'}回复了你的评论`,
        targetId: savedComment.id,
        targetType: 'comment',
        relatedUserId: data.userId,
        relatedUserName: commenter?.name,
      });
    }
    return savedComment;
  }

  async delete(id: number): Promise<void> {
    await this.commentsRepository.delete(id);
  }

  private async enrichComments(items: Comment[], userId?: number): Promise<CommentItem[]> {
    if (items.length === 0) return [];
    const [likeCountSet, likeCountMap] = await Promise.all([
      this.getLikedCommentIds(
        items.map((item) => item.id),
        userId
      ),
      this.getCommentLikeCounts(items.map((item) => item.id)),
    ]);
    return items.map((item) =>
      mapCommentToVo(item, likeCountSet.has(item.id), likeCountMap.get(item.id) || 0)
    );
  }

  private async enrichCommentsWithChildrenCount(
    items: Comment[],
    userId?: number
  ): Promise<CommentItem[]> {
    if (items.length === 0) return [];
    const commentIds = items.map((item) => item.id);
    const [likeCountSet, likeCountMap, childrenCountMap] = await Promise.all([
      this.getLikedCommentIds(commentIds, userId),
      this.getCommentLikeCounts(commentIds),
      this.getChildrenCountMap(commentIds),
    ]);
    return items.map((item) =>
      mapCommentToVo(
        item,
        likeCountSet.has(item.id),
        likeCountMap.get(item.id) || 0,
        childrenCountMap.get(item.id) || 0
      )
    );
  }

  private async getChildrenCountMap(commentIds: number[]): Promise<Map<number, number>> {
    if (commentIds.length === 0) return new Map();
    const counts = await this.commentsRepository
      .createQueryBuilder('comment')
      .select('comment.rootId', 'rootId')
      .addSelect('COUNT(*)', 'count')
      .where('comment.rootId IN (:...ids)', { ids: commentIds })
      .groupBy('comment.rootId')
      .getRawMany();
    return new Map(counts.map((row) => [Number(row.rootId), Number(row.count)]));
  }

  private async getLikedCommentIds(commentIds: number[], userId?: number): Promise<Set<number>> {
    if (commentIds.length === 0) return new Set();
    const counts = await this.commentLikeRepository
      .createQueryBuilder('comment_like')
      .select('comment_like.commentId', 'commentId')
      .where('comment_like.userId = :userId', { userId })
      .andWhere('comment_like.commentId IN (:...ids)', { ids: commentIds })
      .getRawMany();
    return new Set(counts.map((entry) => Number(entry.commentId)));
  }

  private async getCommentLikeCounts(commentIds: number[]): Promise<Map<number, number>> {
    if (commentIds.length === 0) return new Map();
    const counts = await this.commentLikeRepository
      .createQueryBuilder('like')
      .select('like.commentId', 'commentId')
      .addSelect('COUNT(*)', 'count')
      .where('like.commentId IN (:...ids)', { ids: commentIds })
      .groupBy('like.commentId')
      .getRawMany();
    return new Map(counts.map((row) => [Number(row.commentId), Number(row.count)]));
  }

  private buildPageResponse(
    items: CommentItem[],
    total: number,
    page: number,
    limit: number
  ): PageResponse<CommentItem> {
    return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
  }
}
