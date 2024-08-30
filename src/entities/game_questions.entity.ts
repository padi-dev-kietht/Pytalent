import {
  BaseEntity,
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { LogicalQuestions } from './logical_questions.entity';
import { Assessments } from './assessments.entity';

@Entity()
export class GameQuestions extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'integer' })
  question_id: number;

  @Column({ type: 'integer' })
  assessment_id: number;

  @Column({ type: 'integer' })
  order: number;

  @ManyToOne(
    () => Assessments,
    (assessment: Assessments) => assessment.game_questions,
    {
      onDelete: 'CASCADE',
    },
  )
  @JoinColumn({ name: 'assessment_id' })
  assessment: Assessments;

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
