import { AnnouncementsService } from './announcements.service';
import { Announcement as AnnouncementVo } from '@lostfound/schema';
export declare class AnnouncementsController {
    private announcementsService;
    constructor(announcementsService: AnnouncementsService);
    findAll(): Promise<import("./entities/announcement.entity").Announcement[]>;
    findTop(limit?: number): Promise<AnnouncementVo[]>;
    findOne(id: string): Promise<import("./entities/announcement.entity").Announcement>;
    create(data: any, req: any): Promise<import("./entities/announcement.entity").Announcement>;
    update(id: string, data: any): Promise<import("./entities/announcement.entity").Announcement>;
    delete(id: string): Promise<void>;
}
