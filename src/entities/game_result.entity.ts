import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from './base.entity';

@Entity()
export class GameResult extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'integer' })
  game_id: number;

  @Column({ type: 'integer' })
  candidate_id: number;

  @Column({ type: 'integer' })
  assessment_id: number;

  @Column({ type: 'integer' })
  score: number;
}
