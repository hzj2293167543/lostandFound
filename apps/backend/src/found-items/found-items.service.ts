import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FoundItem } from './entities/found-item.entity';
import { FoundItem as FoundItemVo, FoundCreateDto, FoundUpdateDto } from '@lostfound/shared';
import { mapFoundItemToVo } from './found-items.mapper';
import { Category } from 'src/categories/entities/category.entity';
import { UploadService } from '@/common/upload/upload.service';

@Injectable()
export class FoundItemsService {
  constructor(
    @InjectRepository(FoundItem)
    private foundItemsRepository: Repository<FoundItem>,
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
    private uploadService: UploadService
  ) {}

  findAll(): Promise<FoundItem[]> {
    return this.foundItemsRepository.find({
      relations: ['category', 'user'],
      order: { createdAt: 'DESC' },
    });
  }

  async findTop(limit?: number): Promise<FoundItemVo[]> {
    const items = await this.foundItemsRepository.find({
      relations: ['category', 'user'],
      order: { createdAt: 'DESC' },
      take: limit === undefined ? undefined : limit,
    });
    return items.map((item) => mapFoundItemToVo(item));
  }

  async findOne(id: number): Promise<FoundItem> {
    if (id <= 0) {
      return null;
    }
    const item = await this.foundItemsRepository.findOne({
      where: { id },
      relations: ['category', 'user'],
    });
    if (item) {
      await this.foundItemsRepository.increment({ id }, 'viewCount', 1);
    }
    return item;
  }

  async create(data: FoundCreateDto & { userId: number }): Promise<FoundItem> {
    const categoryPo = await this.categoriesRepository.findOne({
      where: { id: data.category },
    });
    if (!categoryPo) {
      throw new NotFoundException('分类不存在');
    }

    const { category: categoryId, ...restData } = data;

    const foundItem = this.foundItemsRepository.create({
      ...restData,
      categoryId,
      commentCount: 0,
      viewCount: 0,
    });

    const savedItem = await this.foundItemsRepository.save(foundItem);
    return savedItem;
  }

  async update(data: FoundUpdateDto): Promise<FoundItem> {
    const { id, category: categoryId, ...restData } = data;
    await this.foundItemsRepository.update(id, { ...restData, categoryId });
    return this.findOne(id);
  }

  async delete(id: number): Promise<void> {
    await this.foundItemsRepository.delete(id);
  }

  findByUser(userId: number): Promise<FoundItem[]> {
    return this.foundItemsRepository.find({
      where: { userId },
      relations: ['category'],
      order: { createdAt: 'DESC' },
    });
  }
}
