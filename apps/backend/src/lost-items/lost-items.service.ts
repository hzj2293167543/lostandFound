import { CommentsService } from '@/comments/comments.service';
import { UploadService } from '@/common/upload/upload.service';
import { LostCreateDto, LostItem as LostItemVo } from '@lostfound/shared';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Category } from 'src/categories/entities/category.entity';
import { Repository } from 'typeorm';
import { LostItem } from './entities/lost-item.entity';
import { mapLostItemToVo } from './lost-items.mapper';

@Injectable()
export class LostItemsService {
  constructor(
    @InjectRepository(LostItem)
    private lostItemsRepository: Repository<LostItem>,
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
    private uploadService: UploadService,
    private commentsService: CommentsService
  ) {}

  async findAll(): Promise<LostItemVo[]> {
    const items = await this.lostItemsRepository.find({
      relations: ['category', 'user'],
      order: { createdAt: 'DESC' },
    });

    const commentCountMap = await this.commentsService.getLostItemCommentCountMap(
      items.map((item) => item.id)
    );
    return items.map((item) => mapLostItemToVo(item, commentCountMap.get(item.id) || 0));
  }

  async findTop(limit?: number): Promise<LostItemVo[]> {
    const items = await this.lostItemsRepository.find({
      relations: ['category', 'user'],
      order: { createdAt: 'DESC' },
      take: limit === undefined ? undefined : limit,
    });

    const commentCountMap = await this.commentsService.getLostItemCommentCountMap(
      items.map((item) => item.id)
    );
    return items.map((item) => mapLostItemToVo(item, commentCountMap.get(item.id) || 0));
  }

  async findOne(id: number): Promise<LostItemVo> {
    const item = await this.lostItemsRepository.findOne({
      where: { id },
      relations: ['category', 'user'],
    });
    const commentCountMap = await this.commentsService.getLostItemCommentCountMap([item.id]);
    if (item) {
      await this.lostItemsRepository.increment({ id }, 'viewCount', 1);
    }
    return mapLostItemToVo(item, commentCountMap.get(item.id) || 0);
  }

  async create(data: LostCreateDto & { userId: number }): Promise<LostItem> {
    const categoryPo = await this.categoriesRepository.findOne({
      where: { id: data.category },
    });
    if (!categoryPo) {
      throw new NotFoundException('分类不存在');
    }

    const { category: categoryId, ...restData } = data;

    const lostItem = this.lostItemsRepository.create({
      ...restData,
      categoryId,
      viewCount: 0,
    });

    try {
      return this.lostItemsRepository.save(lostItem);
    } catch (error) {
      this.uploadService.deleteFile(lostItem.image);
      throw error;
    }
  }

  async update(id: number, data: Partial<LostItem>): Promise<LostItemVo> {
    await this.lostItemsRepository.update(id, data);
    return this.findOne(id);
  }

  async delete(id: number): Promise<void> {
    await this.lostItemsRepository.delete(id);
  }

  async findByUser(userId: number): Promise<LostItem[]> {
    return this.lostItemsRepository.find({
      where: { user: { id: userId } },
      relations: ['category'],
      order: { createdAt: 'DESC' },
    });
  }
}
