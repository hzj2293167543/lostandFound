import { CommentsService } from './comments.service';
export declare class CommentsController {
    private commentsService;
    constructor(commentsService: CommentsService);
    findByItem(itemId: string, itemType: string): Promise<import("./entities/comment.entity").Comment[]>;
    create(data: any, req: any): Promise<import("./entities/comment.entity").Comment>;
    delete(id: string): Promise<void>;
}
