import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';
import { KnowledgeType } from '@lostfound/shared';

@Entity('knowledge_base')
export class KnowledgeBase {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  content: string;

  @Column({ type: 'vector', nullable: true })
  embedding: number[];

  @Column({
    type: 'enum',
    enum: KnowledgeType,
    default: KnowledgeType.FAQ,
  })
  type: (typeof KnowledgeType)[keyof typeof KnowledgeType];

  @Column({ name: 'source_file', nullable: true })
  sourceFile: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
