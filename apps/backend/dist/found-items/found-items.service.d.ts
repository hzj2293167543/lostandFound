import { Repository } from 'typeorm';
import { FoundItem } from './entities/found-item.entity';
import { FoundItem as FoundItemVo } from '@lostfound/schema';
export declare class FoundItemsService {
    private foundItemsRepository;
    foundItemsService: any;
    constructor(foundItemsRepository: Repository<FoundItem>);
    findAll(): Promise<FoundItem[]>;
    findTop(limit?: number): Promise<FoundItemVo[]>;
    findOne(id: number): Promise<FoundItem>;
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
    }): Promise<FoundItem>;
    update(id: number, data: Partial<FoundItem>): Promise<FoundItem>;
    delete(id: number): Promise<void>;
    findByUser(userId: number): Promise<FoundItem[]>;
}
