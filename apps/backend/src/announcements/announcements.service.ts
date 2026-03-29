import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Announcement } from './entities/announcement.entity';
import {
  Announcement as AnnouncementVo,
  GetAnnouncementsParams,
  PageResponse,
} from '@lostfound/shared';
import { mapAnnouncementToVo } from './announcements.mapper';

@Injectable()
export class AnnouncementsService {
  constructor(
    @InjectRepository(Announcement)
    private announcementsRepository: Repository<Announcement>
  ) {}

  async findAllPaginated(params: GetAnnouncementsParams): Promise<PageResponse<AnnouncementVo>> {
    const { page, limit, search } = params;
    const skip = (page - 1) * limit;

    const queryBuilder = this.announcementsRepository
      .createQueryBuilder('announcement')
      .leftJoinAndSelect('announcement.author', 'author')
      .orderBy('announcement.createdAt', 'DESC')
      .skip(skip)
      .take(limit);

    if (search) {
      queryBuilder.andWhere(
        '(announcement.title LIKE :search OR announcement.content LIKE :search)',
        { search: `%${search}%` }
      );
    }

    const [items, total] = await queryBuilder.getManyAndCount();

    return {
      items: items.map((announcement) => mapAnnouncementToVo(announcement)),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    };
  }

  findAll(): Promise<Announcement[]> {
    return this.announcementsRepository.find({
      relations: ['author'],
      order: { createdAt: 'DESC' },
    });
  }

  findOne(id: number): Promise<Announcement> {
    return this.announcementsRepository.findOne({
      where: { id },
      relations: ['author'],
    });
  }

  async findTop(limit: number): Promise<AnnouncementVo[]> {
    const announcements = await this.announcementsRepository.find({
      order: { createdAt: 'DESC' },
      relations: ['author'],
      take: limit === undefined ? undefined : limit,
    });
    return announcements.map((announcement) => mapAnnouncementToVo(announcement));
  }

  create(data: { title: string; content: string; authorId: number }): Promise<Announcement> {
    const announcement = this.announcementsRepository.create({
      ...data,
      time: new Date(),
    });
    return this.announcementsRepository.save(announcement);
  }

  async update(id: number, data: Partial<Announcement>): Promise<Announcement> {
    await this.announcementsRepository.update(id, data);
    return this.findOne(id);
  }

  async delete(id: number): Promise<void> {
    await this.announcementsRepository.delete(id);
  }
}
