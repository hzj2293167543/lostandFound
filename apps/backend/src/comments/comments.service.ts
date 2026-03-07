import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private commentsRepository: Repository<Comment>
  ) {}

  findByItem(itemId: number, itemType: number): Promise<Comment[]> {
    return this.commentsRepository.find({
      where: { itemId, itemType },
      relations: ['user'],
      order: { createdAt: 'DESC' },
    });
  }

  findTop(count?: number): Promise<Comment[]> {
    return this.commentsRepository.find({
      relations: ['user'],
      order: { createdAt: 'DESC' },
      take: count === undefined ? undefined : count,
    });
  }

  create(data: {
    content: string;
    userId: number;
    itemId: number;
    itemType: number;
  }): Promise<Comment> {
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
