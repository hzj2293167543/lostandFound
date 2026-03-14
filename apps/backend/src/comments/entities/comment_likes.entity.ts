import { Entity } from 'typeorm';
import { PrimaryGeneratedColumn } from 'typeorm';
import { Column } from 'typeorm';
import { CreateDateColumn } from 'typeorm';
import { UpdateDateColumn } from 'typeorm';

@Entity('comment_likes')
export class CommentLike {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ name: 'comment_id' })
  commentId: number;

  @Column({ name: 'user_id' })
  userId: number;

  @Column({ name: 'like_time' })
  likeTime: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
