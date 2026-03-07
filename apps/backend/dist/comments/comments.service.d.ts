import { Repository } from 'typeorm';
import { Comment } from './entities/comment.entity';
export declare class CommentsService {
    private commentsRepository;
    constructor(commentsRepository: Repository<Comment>);
    findByItem(itemId: number, itemType: number): Promise<Comment[]>;
    findTop(count?: number): Promise<Comment[]>;
    create(data: {
        content: string;
        userId: number;
        itemId: number;
        itemType: number;
    }): Promise<Comment>;
    delete(id: number): Promise<void>;
}
