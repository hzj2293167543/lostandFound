import { Repository } from 'typeorm';
import { LostItem } from './entities/lost-item.entity';
import { LostItem as LostItemVo } from '@lostfound/schema';
export declare class LostItemsService {
    private lostItemsRepository;
    constructor(lostItemsRepository: Repository<LostItem>);
    findAll(): Promise<LostItem[]>;
    findTop(limit?: number): Promise<LostItemVo[]>;
    findOne(id: number): Promise<LostItem>;
    create(data: {
        title: string;
        categoryId: number;
        description: string;
        time: Date;
        location: string;
        image?: string;
        userId: number;
    }): Promise<LostItem>;
    update(id: number, data: Partial<LostItem>): Promise<LostItem>;
    delete(id: number): Promise<void>;
    findByUser(userId: number): Promise<LostItem[]>;
}
