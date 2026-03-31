import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  DeleteDateColumn,
  OneToMany,
} from 'typeorm';
import { LostItem } from '../../lost-items/entities/lost-item.entity';
import { FoundItem } from '../../found-items/entities/found-item.entity';
import { Comment } from '../../comments/entities/comment.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ length: 255 })
  name: string;

  @Column({ length: 255, nullable: true })
  avatar: string;

  @Column({ length: 255, nullable: true })
  contact: string;

  @Column({ length: 255, nullable: true })
  email: string;

  @Column({ type: 'tinyint', default: 1 })
  status: number;

  @Column({ type: 'timestamp', nullable: true })
  lastLoginAt: Date;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ length: 255, nullable: true })
  password: string;

  @Column({ type: 'tinyint', default: 0 })
  role: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @OneToMany(() => LostItem, (lostItem) => lostItem.user)
  lostItems: LostItem[];

  @OneToMany(() => FoundItem, (foundItem) => foundItem.user)
  foundItems: FoundItem[];

  @OneToMany(() => Comment, (comment) => comment.user)
  comments: Comment[];
}
