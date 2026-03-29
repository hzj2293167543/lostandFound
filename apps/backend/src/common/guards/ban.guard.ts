import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull, MoreThan } from 'typeorm';
import { Punishment, PunishmentType } from '../../reports/entities/punishment.entity';
import { Reflector } from '@nestjs/core';
import { SKIP_BAN } from '../decorators/skipBan.decorator';

@Injectable()
export class BanGuard implements CanActivate {
  constructor(
    private reflector: Reflector,
    @InjectRepository(Punishment)
    private punishmentRepository: Repository<Punishment>
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

    const now = new Date();

    const activeBan = await this.punishmentRepository.findOne({
      where: [
        {
          userId: user.id,
          type: PunishmentType.Ban,
          expireAt: IsNull(),
        },
        {
          userId: user.id,
          type: PunishmentType.Ban,
          expireAt: MoreThan(now),
        },
      ],
    });

    if (activeBan) {
      throw new ForbiddenException('您已被封禁，无法进行此操作');
    }

    return true;
  }
}
