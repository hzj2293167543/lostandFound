import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { Comment } from './entities/comment.entity';
import { CommentLike } from './entities/comment_likes.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Comment, CommentLike])],
  controllers: [CommentsController],
  providers: [CommentsService],
  exports: [CommentsService],
})
export class CommentsModule {}
