import { Repository } from 'typeorm';
import { Announcement } from './entities/announcement.entity';
import { Announcement as AnnouncementVo } from '@lostfound/schema';
export declare class AnnouncementsService {
    private announcementsRepository;
    constructor(announcementsRepository: Repository<Announcement>);
    findAll(): Promise<Announcement[]>;
    findOne(id: number): Promise<Announcement>;
    findTop(limit: number): Promise<AnnouncementVo[]>;
    create(data: {
        title: string;
        content: string;
        authorId: number;
    }): Promise<Announcement>;
    update(id: number, data: Partial<Announcement>): Promise<Announcement>;
    delete(id: number): Promise<void>;
}
