import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LostItemsService } from './lost-items.service';
import { LostItemsController } from './lost-items.controller';
import { LostItem } from './entities/lost-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([LostItem])],
  controllers: [LostItemsController],
  providers: [LostItemsService],
  exports: [LostItemsService],
})
export class LostItemsModule {}
