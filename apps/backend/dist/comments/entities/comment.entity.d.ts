import { User } from '../../users/entities/user.entity';
export declare class Comment {
    id: number;
    content: string;
    time: Date;
    userId: number;
    user: User;
    itemId: number;
    itemType: number;
    createdAt: Date;
    updatedAt: Date;
}
