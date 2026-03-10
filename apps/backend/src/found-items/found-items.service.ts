import { Get, Injectable, ParseIntPipe, Query } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { FoundItem } from './entities/found-item.entity';
import { FoundItem as FoundItemVo } from '@lostfound/shared';
import { mapFoundItemToVo } from './found-items.mapper';

@Injectable()
export class FoundItemsService {
  foundItemsService: any;
  constructor(
    @InjectRepository(FoundItem)
    private foundItemsRepository: Repository<FoundItem>
  ) {}

  findAll(): Promise<FoundItem[]> {
    return this.foundItemsRepository.find({
      relations: ['category', 'user'],
      order: { createdAt: 'DESC' },
    });
  }

  @Get('top')
  async findTop(
    @Query('limit', new ParseIntPipe({ optional: true })) limit?: number
  ): Promise<FoundItemVo[]> {
    const items = await this.foundItemsRepository.find({
      relations: ['category', 'user'],
      order: { createdAt: 'DESC' },
      take: limit === undefined ? undefined : limit,
    });
    console.log(items);
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

  create(data: {
    title: string;
    categoryId: number;
    description: string;
    time: Date;
    location: string;
    storageLocation?: string;
    contactPhone?: string;
    image?: string;
    userId: number;
  }): Promise<FoundItem> {
    const foundItem = this.foundItemsRepository.create({
      ...data,
      commentCount: 0,
      viewCount: 0,
    });
    return this.foundItemsRepository.save(foundItem);
  }

  async update(id: number, data: Partial<FoundItem>): Promise<FoundItem> {
    await this.foundItemsRepository.update(id, data);
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
