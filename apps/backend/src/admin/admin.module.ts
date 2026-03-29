import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnnouncementsModule } from '../announcements/announcements.module';
import { Announcement } from '../announcements/entities/announcement.entity';
import { CategoriesModule } from '../categories/categories.module';
import { Category } from '../categories/entities/category.entity';
import { FoundItem } from '../found-items/entities/found-item.entity';
import { FoundItemsModule } from '../found-items/found-items.module';
import { LostItem } from '../lost-items/entities/lost-item.entity';
import { LostItemsModule } from '../lost-items/lost-items.module';
import { User } from '../users/entities/user.entity';
import { UsersModule } from '../users/users.module';
import { Comment } from '../comments/entities/comment.entity';
import { CommentsModule } from '../comments/comments.module';
import { Report } from '../reports/entities/report.entity';
import { ReportReason } from '../reports/entities/report-reason.entity';
import { Punishment } from '../reports/entities/punishment.entity';
import { AdminController } from './admin.controller';
import { AdminService } from './admin.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      User,
      Category,
      Announcement,
      LostItem,
      FoundItem,
      Comment,
      Report,
      ReportReason,
      Punishment,
    ]),
    UsersModule,
    CategoriesModule,
    AnnouncementsModule,
    LostItemsModule,
    FoundItemsModule,
    CommentsModule,
  ],
  controllers: [AdminController],
  providers: [AdminService],
  exports: [AdminService],
})
export class AdminModule {}
