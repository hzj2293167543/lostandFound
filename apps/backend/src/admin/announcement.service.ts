import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AnnouncementCreateDto, AnnouncementEditDto } from '@lostfound/shared';
import { Announcement } from '../announcements/entities/announcement.entity';

@Injectable()
export class AnnouncementService {
  constructor(
    @InjectRepository(Announcement)
    private announcementsRepository: Repository<Announcement>
  ) {}

  getAllAnnouncements(): Promise<Announcement[]> {
    return this.announcementsRepository.find({
      order: { time: 'DESC' },
    });
  }

  async getAnnouncementsPaginated(page: number, pageSize: number) {
    const [items, total] = await this.announcementsRepository.findAndCount({
      skip: (page - 1) * pageSize,
      take: pageSize,
      order: { time: 'DESC' },
    });
    return {
      items,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  createAnnouncement(data: Partial<AnnouncementCreateDto>): Promise<Announcement> {
    const { author, ...rest } = data;
    const announcement = this.announcementsRepository.create({
      ...rest,
      authorId: author,
      time: new Date(),
    });
    return this.announcementsRepository.save(announcement);
  }

  async updateAnnouncement(id: number, data: Partial<AnnouncementEditDto>): Promise<Announcement> {
    const exists = await this.announcementsRepository.exists({ where: { id } });
    if (!exists) {
      throw new Error('Announcement not found');
    }
    const { author, ...rest } = data;
    const announcement = new Announcement();
    Object.assign(announcement, rest);
    announcement.authorId = author;
    announcement.time = new Date();
    await this.announcementsRepository.update(id, announcement);
    return this.announcementsRepository.findOne({ where: { id } });
  }

  async deleteAnnouncement(id: number): Promise<void> {
    await this.announcementsRepository.delete(id);
  }
}
