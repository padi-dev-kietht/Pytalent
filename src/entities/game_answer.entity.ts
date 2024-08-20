import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { Games } from './games.entity';
import { LogicalQuestions } from './logical_questions.entity';
import { MemoryGame } from './memory_game.entity';

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

  @Column({ type: 'text' })
  answer: string;

  @Column({ type: 'integer' })
  score: number;

  @Column({ type: 'boolean' })
  is_correct: boolean;

  // Associations
  @ManyToOne(() => Games, (game: Games) => game.game_answers)
  @JoinColumn({ name: 'game_id' })
  game: Games;

  @ManyToOne(
    () => LogicalQuestions,
    (question: LogicalQuestions) => question.game_answers,
  )
  @JoinColumn({ name: 'question_id' })
  question: LogicalQuestions;

  @ManyToOne(() => MemoryGame, (memory: MemoryGame) => memory.game_answers)
  @JoinColumn({ name: 'level_id' })
  level: MemoryGame;
}
