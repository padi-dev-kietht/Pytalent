import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Games } from './games.entity';
import { LogicalQuestions } from './logical_questions.entity';

@Entity()
export class GameQuestions extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'integer' })
  game_id: number;

  @Column({ type: 'integer' })
  question_id: number;

  @Column({ type: 'integer' })
  order: number;

  @ManyToOne(() => Games, (game: Games) => game.game_questions, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'game_id' })
  game: Games;

  @ManyToOne(
    () => LogicalQuestions,
    (question: LogicalQuestions) => question.game_questions,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'question_id' })
  question: LogicalQuestions;
}
