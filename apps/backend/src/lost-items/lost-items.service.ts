import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { LostItem } from './entities/lost-item.entity';
import { LostItem as LostItemVo } from '@lostfound/schema';
import { mapLostItemToVo } from './lost-items.mapper';

@Injectable()
export class LostItemsService {
  constructor(
    @InjectRepository(LostItem)
    private lostItemsRepository: Repository<LostItem>
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

  async create(data: {
    title: string;
    categoryId: number;
    description: string;
    time: Date;
    location: string;
    image?: string;
    userId: number;
  }): Promise<LostItem> {
    const lostItem = this.lostItemsRepository.create({
      ...data,
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
