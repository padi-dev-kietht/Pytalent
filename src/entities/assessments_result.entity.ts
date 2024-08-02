import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { Assessments } from './assessments.entity';
import { Games } from './games.entity';

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

  //Associations
  @ManyToOne(() => Assessments, (assessment: Assessments) => assessment.results)
  @JoinColumn({ name: 'assessment_id' })
  assessment: Assessments;

  @ManyToOne(() => Games, (game: Games) => game.results)
  @JoinColumn({ name: 'game_id' })
  game: Games;
}
