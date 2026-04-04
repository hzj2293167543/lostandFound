import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

export enum KnowledgeType {
  FAQ = 'faq',
  NOTICE = 'notice',
  RULE = 'rule',
}

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
  type: KnowledgeType;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;
}
