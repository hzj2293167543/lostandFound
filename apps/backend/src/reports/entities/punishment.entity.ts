import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Report } from './report.entity';

export enum PunishmentType {
  Warning = 1,
  Mute = 2,
  Ban = 3,
}

@Entity('punishments')
export class Punishment {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ name: 'user_id' })
  userId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ type: 'tinyint' })
  type: PunishmentType;

  @Column({ name: 'duration_days', default: 0 })
  durationDays: number;

  @Column({ name: 'expire_at', type: 'datetime', nullable: true })
  expireAt: Date;

  @Column({ length: 500, nullable: true })
  reason: string;

  @Column({ name: 'handler_id' })
  handlerId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'handler_id' })
  handler: User;

  @Column({ name: 'report_id', nullable: true })
  reportId: number;

  @ManyToOne(() => Report, { nullable: true })
  @JoinColumn({ name: 'report_id' })
  report: Report;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
