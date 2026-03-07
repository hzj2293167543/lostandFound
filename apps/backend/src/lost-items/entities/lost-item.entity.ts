import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  OneToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Category } from '../../categories/entities/category.entity';

@Entity('lost_items')
export class LostItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  title: string;

  @ManyToOne(() => Category)
  category: Category;

  @Column('text')
  description: string;

  @Column({ type: 'datetime' })
  time: Date;

  @Column({ length: 255 })
  location: string;

  @Column({ type: 'tinyint', default: 0 })
  status: number;

  @Column({ length: 255, nullable: true })
  image: string;

  @ManyToOne(() => User)
  user: User;

  @Column({ default: 0 })
  commentCount: number;

  @Column({ default: 0 })
  viewCount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
