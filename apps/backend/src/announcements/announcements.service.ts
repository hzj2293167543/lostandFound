import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Announcement } from './entities/announcement.entity';
import { Announcement as AnnouncementVo } from '@lostfound/shared';
import { mapAnnouncementToVo } from './announcements.mapper';
@Injectable()
export class AnnouncementsService {
  constructor(
    @InjectRepository(Announcement)
    private announcementsRepository: Repository<Announcement>
  ) {}

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
