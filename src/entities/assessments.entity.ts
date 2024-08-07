import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { Invitations } from './invitations.entity';
import { AssessmentsResult } from './assessments_result.entity';
import { Games } from './games.entity';
import { GameResult } from './game_result.entity';

@Entity()
export class Assessments extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'text' })
  description: string;

  @Column({ type: 'datetime', nullable: true })
  start_date: Date;

  @Column({ type: 'datetime', nullable: true })
  end_date: Date;

  @Column({ type: 'int' })
  created_by: number;

  @Column({ type: 'boolean' })
  is_archived: boolean;

  //Associations
  @OneToMany(
    () => Invitations,
    (invitation: Invitations) => invitation.assessment,
  )
  invitations: Invitations[];

  @OneToMany(
    () => AssessmentsResult,
    (result: AssessmentsResult) => result.assessment,
  )
  results: AssessmentsResult[];

  @OneToMany(() => GameResult, (result: GameResult) => result.assessment)
  game_results: GameResult[];

  @ManyToMany(() => Games, (game: Games) => game.assessments)
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
