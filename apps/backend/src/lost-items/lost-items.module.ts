import { Category } from '@/categories/entities/category.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LostItem } from './entities/lost-item.entity';
import { LostItemsController } from './lost-items.controller';
import { LostItemsService } from './lost-items.service';
import { UploadService } from '@/common/upload/upload.service';

@Module({
  imports: [TypeOrmModule.forFeature([LostItem, Category])],
  controllers: [LostItemsController],
  providers: [LostItemsService, UploadService],
  exports: [LostItemsService],
})
export class LostItemsModule {}
