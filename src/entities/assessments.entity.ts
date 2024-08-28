import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { Invitations } from './invitations.entity';
import { AssessmentsResult } from './assessments_result.entity';
import { Games } from './games.entity';
import { GameResult } from './game_result.entity';
import { Users } from './users.entity';
import { GameQuestions } from './game_questions.entity';
import { GameAnswer } from './game_answer.entity';
import { AssessmentStatusEnum } from '../common/enum/assessment-status.enum';

@Entity()
export class Assessments extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({
    type: 'datetime',
    nullable: true,
    default: () => 'CURRENT_TIMESTAMP',
  })
  start_date: Date;

  @Column({ type: 'datetime', nullable: true })
  end_date: Date;

  @Column({ type: 'int' })
  created_by: number;

  @Column({
    type: 'varchar',
    default: AssessmentStatusEnum.IDLE,
    nullable: true,
  })
  status: AssessmentStatusEnum;

  @Column({ type: 'boolean', default: false })
  is_archived: boolean;

  //Associations
  @ManyToMany(
    () => Users,
    (candidate: Users) => candidate.assessments_candidates,
    {
      onDelete: 'CASCADE',
    },
  )
  candidates: Users[];

  @OneToMany(() => GameAnswer, (answer: GameAnswer) => answer.assessment, {
    cascade: true,
  })
  game_answers: GameAnswer[];

  @OneToMany(
    () => GameQuestions,
    (question: GameQuestions) => question.assessment,
    {
      cascade: true,
    },
  )
  game_questions: GameQuestions[];

  @OneToMany(
    () => Invitations,
    (invitation: Invitations) => invitation.assessment,
    { cascade: true },
  )
  invitations: Invitations[];

  @OneToMany(
    () => AssessmentsResult,
    (result: AssessmentsResult) => result.assessment,
    { cascade: true },
  )
  results: AssessmentsResult[];

  @OneToMany(() => GameResult, (result: GameResult) => result.assessment, {
    cascade: true,
  })
  game_results: GameResult[];

  @ManyToOne(() => Users, (hr: Users) => hr.assessments, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'created_by' })
  created_by_hr: Users;

  @ManyToMany(() => Games, (game: Games) => game.assessments, {
    onDelete: 'CASCADE',
  })
  @JoinTable({
    name: 'assessments_games',
    joinColumn: {
      name: 'assessment_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'game_id',
      referencedColumnName: 'id',
    },
  })
  games: Games[];
}
