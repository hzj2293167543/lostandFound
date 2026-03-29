import { Injectable, CanActivate, ExecutionContext, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull, MoreThan } from 'typeorm';
import { Punishment, PunishmentType } from '../../reports/entities/punishment.entity';
import { diffDay } from '@lostfound/shared';

@Injectable()
export class MuteGuard implements CanActivate {
  constructor(
    @InjectRepository(Punishment)
    private punishmentRepository: Repository<Punishment>
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const user = request.user;

    if (!user || !user.id) {
      return true;
    }

    const now = new Date();

    const activeMute = await this.punishmentRepository.findOne({
      where: [
        {
          userId: user.id,
          type: PunishmentType.Mute,
          expireAt: IsNull(),
        },
        {
          userId: user.id,
          type: PunishmentType.Mute,
          expireAt: MoreThan(now),
        },
      ],
    });

    if (activeMute) {
      const expireAt = activeMute.expireAt;
      const durationTime = diffDay(expireAt, now);
      const expireStr = expireAt ? `，将于 ${durationTime.toFixed(2)}天后解除` : '，已被永久禁言';

      const isCommentAction = request.path?.includes('/comments') && request.method === 'POST';
      const isFoundAction = request.path?.includes('/found-items') && request.method === 'POST';
      const isLostAction = request.path?.includes('/lost-items') && request.method === 'POST';
      if (isCommentAction || isFoundAction || isLostAction) {
        throw new ForbiddenException(`您已被禁言${expireStr}，无法发布内容`);
      }
    }

    return true;
  }
}
