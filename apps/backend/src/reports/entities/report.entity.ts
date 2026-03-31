import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { ReportReason } from './report-reason.entity';
import { ReportStatus, TReportStatusType, TReportTargetType } from '@lostfound/shared';

@Entity('reports')
export class Report {
  @PrimaryGeneratedColumn({ type: 'bigint' })
  id: number;

  @Column({ name: 'reporter_id' })
  reporterId: number;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'reporter_id' })
  reporter: User;

  @Column({ type: 'tinyint' })
  targetType: TReportTargetType;

  @Column({ name: 'target_id' })
  targetId: number;

  @Column({ name: 'reason_id', nullable: true })
  reasonId: number;

  @ManyToOne(() => ReportReason, { nullable: true })
  @JoinColumn({ name: 'reason_id' })
  reason: ReportReason;

  @Column({ name: 'reason_desc', length: 500, nullable: true })
  reasonDesc: string;

  @Column({ name: 'evidence_images', type: 'json', nullable: true })
  evidenceImages: string[];

  @Column({ type: 'json' })
  snapshot: Record<string, unknown>;

  @Column({ type: 'tinyint', default: ReportStatus.Pending })
  status: TReportStatusType;

  @Column({ name: 'handler_id', nullable: true })
  handlerId: number;

  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'handler_id' })
  handler: User;

  @Column({ name: 'handled_at', type: 'datetime', nullable: true })
  handledAt: Date;

  @Column({ name: 'handling_result', length: 200, nullable: true })
  handlingResult: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
