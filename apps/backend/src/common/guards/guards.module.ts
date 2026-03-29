import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { APP_GUARD } from '@nestjs/core';
import { BanGuard } from './ban.guard';
import { Punishment } from '../../reports/entities/punishment.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Punishment])],
  providers: [
    {
      provide: APP_GUARD,
      useClass: BanGuard,
    },
  ],
})
export class GuardsModule {}
