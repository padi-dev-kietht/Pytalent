import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
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
