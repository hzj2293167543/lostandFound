import { NotificationTypeValue } from '@lostfound/shared';
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
export { NotificationType, NotificationTypeValue } from '@lostfound/shared';

@Entity('notifications')
export class Notification {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ name: 'user_id', type: 'bigint' })
  userId: number;

  @Column({ type: 'tinyint' })
  type: NotificationTypeValue;

  @Column({ length: 500 })
  message: string;

  @Column({ name: 'target_id', type: 'bigint', nullable: true })
  targetId: number | null;

  @Column({ name: 'target_type', length: 50, nullable: true })
  targetType: string | null;

  @Column({ name: 'related_user_id', type: 'bigint', nullable: true })
  relatedUserId: number | null;

  @Column({ name: 'related_user_name', length: 255, nullable: true })
  relatedUserName: string | null;

  @Column({ name: 'read_status', type: 'tinyint', default: 0 })
  readStatus: number;

  @Column({ name: 'read_at', type: 'datetime', nullable: true })
  readAt: Date | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date | null;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'related_user_id' })
  relatedUser: User;
}
