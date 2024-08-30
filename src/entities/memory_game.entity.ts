import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity()
export class MemoryGame extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'integer' })
  level: number;

  @Column({ type: 'integer' })
  number_of_patterns: number;

  @Column({ type: 'integer' })
  display_time: number;

  @Column({ type: 'integer' })
  input_time: number;

  @Column({ type: 'text' })
  patterns: string;

  @Column({ type: 'integer', default: 1 })
  order: number;

  @Column({ type: 'integer', nullable: true })
  assessment_id: number;

  // Associations
}
