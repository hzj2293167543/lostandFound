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

@Entity('comments')
export class Comment {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  content: string;

  @Column({ type: 'datetime' })
  time: Date;

  @Column({ nullable: true })
  @JoinColumn({ name: 'parent_id' })
  parentId: number | null;

  @ManyToOne(() => Comment, { nullable: true })
  @JoinColumn({ name: 'parent_id' })
  parent: Comment | null;

  @Column()
  @JoinColumn({ name: 'user_id' })
  userId: number;

  @ManyToOne(() => User, (user) => user.comments)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column()
  itemId: number;

  @Column({ type: 'tinyint' })
  itemType: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
