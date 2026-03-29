import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommentsService } from './comments.service';
import { CommentsController } from './comments.controller';
import { Comment } from './entities/comment.entity';
import { CommentLike } from './entities/comment_likes.entity';
import { MuteGuard } from '@/common/guards/mute.guard';
import { Punishment } from '@/reports/entities/punishment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Comment, CommentLike, Punishment])],
  controllers: [CommentsController],
  providers: [CommentsService, MuteGuard],
  exports: [CommentsService],
})
export class CommentsModule {}
