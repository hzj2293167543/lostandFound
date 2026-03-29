import { Category } from '@/categories/entities/category.entity';
import { CommentsModule } from '@/comments/comments.module';
import { UploadService } from '@/common/upload/upload.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LostItem } from './entities/lost-item.entity';
import { LostItemsController } from './lost-items.controller';
import { LostItemsService } from './lost-items.service';
import { CategoriesModule } from '@/categories/categories.module';
import { Punishment } from '@/reports/entities/punishment.entity';
import { MuteGuard } from '@/common/guards/mute.guard';

@Module({
  imports: [TypeOrmModule.forFeature([LostItem, Punishment]), CommentsModule, CategoriesModule],
  controllers: [LostItemsController],
  providers: [LostItemsService, UploadService, MuteGuard],
  exports: [LostItemsService],
})
export class LostItemsModule {}
