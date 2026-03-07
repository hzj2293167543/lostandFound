import { User } from '../../users/entities/user.entity';
import { Category } from '../../categories/entities/category.entity';
export declare class LostItem {
    id: number;
    title: string;
    category: Category;
    description: string;
    time: Date;
    location: string;
    status: number;
    image: string;
    user: User;
    commentCount: number;
    viewCount: number;
    createdAt: Date;
    updatedAt: Date;
}
