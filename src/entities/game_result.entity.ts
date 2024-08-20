import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { Games } from './games.entity';
import { Users } from './users.entity';
import { Assessments } from './assessments.entity';

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

  @ManyToOne(() => Games, (game: Games) => game.game_results, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'game_id' })
  game: Games;

  @ManyToOne(() => Users, (user: Users) => user.game_results, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'candidate_id' })
  candidate: Users;

  @ManyToOne(
    () => Assessments,
    (assessment: Assessments) => assessment.game_results,
    { onDelete: 'CASCADE' },
  )
  @JoinColumn({ name: 'assessment_id' })
  assessment: Assessments;
}
