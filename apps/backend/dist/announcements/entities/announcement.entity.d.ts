import { User } from '../../users/entities/user.entity';
export declare class Announcement {
    id: number;
    title: string;
    content: string;
    time: Date;
    author: User;
    createdAt: Date;
    updatedAt: Date;
}
