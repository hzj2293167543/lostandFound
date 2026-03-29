import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  UseGuards,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull, MoreThan } from 'typeorm';
import { Punishment, PunishmentType } from '../../reports/entities/punishment.entity';
import { Reflector } from '@nestjs/core';
import { SKIP_BAN } from '../decorators/skipBan.decorator';
import { UserStatus } from '../constants/constants';
import { User } from '@/users/entities/user.entity';
import { AuthGuard } from '@nestjs/passport';
import { ReportsService } from '@/reports/reports.service';
import { UsersService } from '@/users/users.service';
import { diffDay } from '@lostfound/shared';

@Injectable()
export class BanGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    private reportService: ReportsService,
    private usersService: UsersService
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // 检查是否有跳过封禁检查的装饰器
    const skipBan = this.reflector.get<boolean>(SKIP_BAN, context.getHandler());
    if (skipBan) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.id) {
      return true;
    }
    let expireStr = '';
    const activeBanPublic = await this.reportService.getActiveBan(user.id);
    const activeBanAdmin = await this.usersService.getActiveBan(user.id);
    if (activeBanPublic) {
      const now = new Date();
      const expireAt = activeBanPublic.expireAt;
      const durationTime = diffDay(expireAt, now);
      expireStr = expireAt ? `，将于 ${durationTime.toFixed(2)}天后解除` : '，已被永久封禁';
    }
    if (activeBanAdmin) {
      expireStr = '，已被管理员封禁';
    }
    if (activeBanPublic || activeBanAdmin) {
      throw new ForbiddenException({
        message: `您已被封禁${expireStr}，无法进行此操作`,
        bizCode: 'Banned',
      });
    }

    return true;
  }
}
