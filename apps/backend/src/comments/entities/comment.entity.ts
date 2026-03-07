import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
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

  @Column()
  userId: number;

  @ManyToOne(() => User, (user) => user.comments)
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
