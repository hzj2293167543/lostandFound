import { FoundItemsService } from './found-items.service';
import { FoundItem as FoundItemVo } from '@lostfound/schema';
export declare class FoundItemsController {
    private foundItemsService;
    constructor(foundItemsService: FoundItemsService);
    findAll(): Promise<import("./entities/found-item.entity").FoundItem[]>;
    findTop(limit?: number): Promise<FoundItemVo[]>;
    findByUser(userId: string): Promise<import("./entities/found-item.entity").FoundItem[]>;
    findOne(id: string): Promise<import("./entities/found-item.entity").FoundItem>;
    create(data: any, req: any): Promise<import("./entities/found-item.entity").FoundItem>;
    update(id: string, data: any, req: any): Promise<import("./entities/found-item.entity").FoundItem>;
    delete(id: string, req: any): Promise<void>;
}
