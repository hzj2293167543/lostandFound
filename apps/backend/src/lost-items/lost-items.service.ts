import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LostItem } from './entities/lost-item.entity';
import { LostCreateDto, LostItem as LostItemVo } from '@lostfound/shared';
import { mapLostItemToVo } from './lost-items.mapper';
import { Category } from 'src/categories/entities/category.entity';

@Injectable()
export class LostItemsService {
  constructor(
    @InjectRepository(LostItem)
    private lostItemsRepository: Repository<LostItem>,
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>
  ) {}

  async findAll(): Promise<LostItem[]> {
    return this.lostItemsRepository.find({
      relations: ['category', 'user'],
      order: { createdAt: 'DESC' },
    });
  }

  async findTop(limit?: number): Promise<LostItemVo[]> {
    const items = await this.lostItemsRepository.find({
      relations: ['category', 'user'],
      order: { createdAt: 'DESC' },
      take: limit === undefined ? undefined : limit,
    });
    console.log(items);
    return items.map((item) => mapLostItemToVo(item));
  }

  async findOne(id: number): Promise<LostItem> {
    const item = await this.lostItemsRepository.findOne({
      where: { id },
      relations: ['category', 'user'],
    });
    if (item) {
      await this.lostItemsRepository.increment({ id }, 'viewCount', 1);
    }
    return item;
  }

  async create(data: LostCreateDto & { userId: number }): Promise<LostItem> {
    const categoryPo = await this.categoriesRepository.findOne({
      where: { id: data.category },
    });
    if (!categoryPo) {
      throw new NotFoundException('分类不存在');
    }
    const category = { id: categoryPo.id, name: categoryPo.name };
    const lostItem = this.lostItemsRepository.create({
      ...data,
      category,
      commentCount: 0,
      viewCount: 0,
    });
    return this.lostItemsRepository.save(lostItem);
  }

  async update(id: number, data: Partial<LostItem>): Promise<LostItem> {
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
