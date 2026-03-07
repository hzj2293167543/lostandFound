import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { FoundItemsService } from './found-items.service';
import { FoundItemsController } from './found-items.controller';
import { FoundItem } from './entities/found-item.entity';

@Module({
  imports: [TypeOrmModule.forFeature([FoundItem])],
  controllers: [FoundItemsController],
  providers: [FoundItemsService],
  exports: [FoundItemsService],
})
export class FoundItemsModule {}
