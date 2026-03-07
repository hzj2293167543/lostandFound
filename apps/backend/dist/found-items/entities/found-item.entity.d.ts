import { User } from '../../users/entities/user.entity';
import { Category } from '../../categories/entities/category.entity';
export declare class FoundItem {
    id: number;
    title: string;
    categoryId: number;
    category: Category;
    description: string;
    time: Date;
    location: string;
    storageLocation: string;
    contactPhone: string;
    status: number;
    image: string;
    viewCount: number;
    userId: number;
    user: User;
    commentCount: number;
    createdAt: Date;
    updatedAt: Date;
}
