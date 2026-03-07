import { LostItem } from '../../lost-items/entities/lost-item.entity';
import { FoundItem } from '../../found-items/entities/found-item.entity';
import { Comment } from '../../comments/entities/comment.entity';
export declare class User {
    id: number;
    name: string;
    avatar: string;
    contact: string;
    email: string;
    status: number;
    lastLoginAt: Date;
    description: string;
    password: string;
    role: number;
    createdAt: Date;
    updatedAt: Date;
    lostItems: LostItem[];
    foundItems: FoundItem[];
    comments: Comment[];
}
