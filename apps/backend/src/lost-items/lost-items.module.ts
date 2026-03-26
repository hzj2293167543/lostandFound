import { Category } from '@/categories/entities/category.entity';
import { CommentsModule } from '@/comments/comments.module';
import { UploadService } from '@/common/upload/upload.service';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LostItem } from './entities/lost-item.entity';
import { LostItemsController } from './lost-items.controller';
import { LostItemsService } from './lost-items.service';
import { CategoriesModule } from '@/categories/categories.module';

@Module({
  imports: [TypeOrmModule.forFeature([LostItem]), CommentsModule, CategoriesModule],
  controllers: [LostItemsController],
  providers: [LostItemsService, UploadService],
  exports: [LostItemsService],
})
export class LostItemsModule {}
