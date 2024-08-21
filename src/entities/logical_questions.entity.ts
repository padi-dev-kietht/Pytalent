import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { GameQuestions } from './game_questions.entity';

@Entity()
export class LogicalQuestions extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  statement_one: string;

  @Column({ type: 'varchar' })
  statement_two: string;

  @Column({ type: 'varchar' })
  conclusion: string;

  @Column({ type: 'boolean' })
  is_conclusion_correct: boolean;

  @OneToMany(
    () => GameQuestions,
    (question: GameQuestions) => question.question,
  )
  game_questions: GameQuestions[];
}
