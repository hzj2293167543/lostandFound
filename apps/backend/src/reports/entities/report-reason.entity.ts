import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('report_reasons')
export class ReportReason {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 100 })
  reasonText: string;

  @Column({ type: 'tinyint', nullable: true })
  targetType: number;

  @Column({ default: 0 })
  sortOrder: number;

  @Column({ type: 'tinyint', default: 1 })
  isActive: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
