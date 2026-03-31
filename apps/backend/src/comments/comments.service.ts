import { CommentItemTypeType } from '@/common/constants/constants';
import { CommentCreateDto, CommentItem, PageResponse } from '@lostfound/shared';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IsNull, Repository } from 'typeorm';
import { mapCommentToVo } from './comments.mapper';
import { Comment } from './entities/comment.entity';
import { CommentLike } from './entities/comment_likes.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentsRepository: Repository<Comment>,
    @InjectRepository(CommentLike)
    private commentLikeRepository: Repository<CommentLike>
  ) {}

  async findByItem(itemId: number, itemType: number, userId?: number): Promise<CommentItem[]> {
    const rowsItems = await this.commentsRepository.find({
      where: { itemId, itemType },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });

    const likeCountSet = await this.getLikedCommentIds(
      rowsItems.map((item) => item.id),
      userId
    );

    const likeCountMap = await this.getCommentLikeCounts(rowsItems.map((item) => item.id));

    return rowsItems.map((item) =>
      mapCommentToVo(item, likeCountSet.has(item.id), likeCountMap.get(item.id) || 0)
    );
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

    const likeCountSet = await this.getLikedCommentIds(
      items.map((item) => item.id),
      userId
    );

    const likeCountMap = await this.getCommentLikeCounts(items.map((item) => item.id));
    const childrenCountMap = await this.getChildrenCountMap(items.map((item) => item.id));

    return {
      items: items.map((item) =>
        mapCommentToVo(
          item,
          likeCountSet.has(item.id),
          likeCountMap.get(item.id) || 0,
          childrenCountMap.get(item.id) || 0
        )
      ),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
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

  async getLikedCommentIds(commentIds: number[], userId?: number): Promise<Set<number>> {
    if (commentIds.length === 0) return new Set();

    const counts = await this.commentLikeRepository
      .createQueryBuilder('comment_like')
      .select('comment_like.commentId', 'commentId')
      .where('comment_like.userId = :userId', { userId })
      .andWhere('comment_like.commentId IN (:...ids)', { ids: commentIds })
      .getRawMany();

    return new Set(counts.map((entry) => Number(entry.commentId)));
  }

  async getCommentLikeCounts(commentIds: number[]): Promise<Map<number, number>> {
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

    const likeCountSet = await this.getLikedCommentIds(
      items.map((item) => item.id),
      userId
    );

    const likeCountMap = await this.getCommentLikeCounts(items.map((item) => item.id));
    return {
      items: items.map((item) =>
        mapCommentToVo(item, likeCountSet.has(item.id), likeCountMap.get(item.id) || 0)
      ),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  findLikes(id: number): Promise<number> {
    return this.commentLikeRepository.count({ where: { commentId: id } });
  }

  findLiked(id: number, userId: number): Promise<boolean> {
    return this.commentLikeRepository.exists({
      where: { commentId: id, userId },
    });
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

    const map = new Map<number, number>();
    counts.forEach((entry) => {
      map.set(Number(entry.itemId), Number(entry.count));
    });
    return map;
  }

  async likeComment(id: number, userId: number, isLike: boolean): Promise<void> {
    if (isLike) {
      if (await this.findLiked(id, userId)) throw new Error('已点赞');
      await this.commentLikeRepository.insert({ commentId: id, userId, likeTime: new Date() });
    } else {
      await this.commentLikeRepository.delete({ commentId: id, userId });
    }
  }

  findTop(count?: number): Promise<Comment[]> {
    return this.commentsRepository.find({
      relations: ['user'],
      order: { createdAt: 'DESC' },
      take: count === undefined ? undefined : count,
    });
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

    const likeCountSet = await this.getLikedCommentIds(
      items.map((item) => item.id),
      userId
    );

    const likeCountMap = await this.getCommentLikeCounts(items.map((item) => item.id));

    return {
      items: items.map((item) =>
        mapCommentToVo(item, likeCountSet.has(item.id), likeCountMap.get(item.id) || 0)
      ),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  async create(data: CommentCreateDto & { userId: number }): Promise<Comment> {
    let rootId: number | null = null;

    if (data.parentId !== null && data.parentId !== undefined) {
      const parent = await this.commentsRepository.findOne({
        where: { id: data.parentId },
        select: ['rootId'],
      });
      rootId = parent?.rootId ?? data.parentId;
    }

    const comment = this.commentsRepository.create({
      ...data,
      rootId,
      time: new Date(),
    });
    return this.commentsRepository.save(comment);
  }

  async delete(id: number): Promise<void> {
    await this.commentsRepository.delete(id);
  }
}
