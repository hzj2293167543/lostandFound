import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Category } from '../../categories/entities/category.entity';

@Entity('found_items')
export class FoundItem {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  title: string;

  @Column({ name: 'category_id' })
  categoryId: number;

  @ManyToOne(() => Category, (category) => category)
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @Column('text')
  description: string;

  @Column({ type: 'datetime' })
  time: Date;

  @Column({ length: 255 })
  location: string;

  @Column({ length: 255, nullable: true })
  storageLocation: string;

  @Column({ length: 20, nullable: true })
  contactPhone: string;

  @Column({ type: 'tinyint', default: 0 })
  status: number;

  @Column({ length: 255, nullable: true })
  image: string;

  @Column({ default: 0 })
  viewCount: number;

  @Column({ name: 'user_id' })
  userId: number;

  @ManyToOne(() => User, (user) => user.foundItems)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @Column({ default: 0 })
  commentCount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;
}
