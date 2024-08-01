import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity()
export class AssessmentsResult extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'int' })
  score: number;

  @Column({ type: 'int' })
  assessment_id: number;

  @Column({ type: 'int' })
  game_id: number;

  @Column({ type: 'datetime' })
  completed_at: Date;
}
