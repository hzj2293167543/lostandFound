import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
import { CommentCreateDto, CommentItem } from '@lostfound/shared';
import { mapCommentToVo } from './comments.mapper';
import { CommentItemType, CommentItemTypeType } from '@/common/constants/constants';
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

  findByUser(userId: number): Promise<Comment[]> {
    return this.commentsRepository.find({
      where: { userId },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  create(data: CommentCreateDto & { userId: number }): Promise<Comment> {
    const comment = this.commentsRepository.create({
      ...data,
      time: new Date(),
    });
    return this.commentsRepository.save(comment);
  }

  async delete(id: number): Promise<void> {
    await this.commentsRepository.delete(id);
  }
}
