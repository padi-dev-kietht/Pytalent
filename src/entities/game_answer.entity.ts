import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { Games } from './games.entity';
import { MemoryGame } from './memory_game.entity';
import { Assessments } from './assessments.entity';

@Entity()
export class GameAnswer extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'integer' })
  game_id: number;

  @Column({ type: 'integer', nullable: true })
  question_id: number;

  @Column({ type: 'integer', nullable: true })
  level_id: number;

  @Column({ type: 'integer', nullable: true })
  assessment_id: number;

  @Column({ type: 'text' })
  answer: string;

  @Column({ type: 'integer' })
  score: number;

  @Column({ type: 'boolean' })
  is_correct: boolean;

  @Column({ type: 'integer', nullable: true })
  total_time: number;

  @Column({ type: 'integer', nullable: true })
  time_taken: number;

  // Associations
  @ManyToOne(
    () => Assessments,
    (assessment: Assessments) => assessment.game_answers,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'assessment_id' })
  assessment: Assessments;

  @ManyToOne(() => Games, (game: Games) => game.game_answers, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'game_id' })
  game: Games;

  @ManyToOne(() => MemoryGame, (memory: MemoryGame) => memory.game_answers, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'level_id' })
  level: MemoryGame;
}
