import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FoundItemsService } from './found-items.service';
import { FoundItemsController } from './found-items.controller';
import { FoundItem } from './entities/found-item.entity';
import { Category } from '@/categories/entities/category.entity';
import { UploadService } from '@/common/upload/upload.service';
import { CommentsModule } from '@/comments/comments.module';
@Module({
  imports: [TypeOrmModule.forFeature([FoundItem, Category]), CommentsModule],
  controllers: [FoundItemsController],
  providers: [FoundItemsService, UploadService],
  exports: [FoundItemsService],
})
export class FoundItemsModule {}
