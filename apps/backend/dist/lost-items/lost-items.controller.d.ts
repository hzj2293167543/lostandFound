import { LostItemsService } from './lost-items.service';
import { LostItem as LostItemVo } from '@lostfound/schema';
export declare class LostItemsController {
    private lostItemsService;
    constructor(lostItemsService: LostItemsService);
    findAll(categoryId?: string): Promise<import("./entities/lost-item.entity").LostItem[]>;
    findTop(limit?: number): Promise<LostItemVo[]>;
    findByUser(userId: string): Promise<import("./entities/lost-item.entity").LostItem[]>;
    findOne(id: string): Promise<import("./entities/lost-item.entity").LostItem>;
    create(data: any, req: any): Promise<import("./entities/lost-item.entity").LostItem>;
    update(id: string, data: any, req: any): Promise<import("./entities/lost-item.entity").LostItem>;
    delete(id: string, req: any): Promise<void>;
}
