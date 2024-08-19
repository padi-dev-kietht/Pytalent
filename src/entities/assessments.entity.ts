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

  @Column({ type: 'int', nullable: true })
  candidate_id: number;

  @Column({ type: 'boolean', default: false })
  is_archived: boolean;

  //Associations
  @ManyToOne(() => Users, (candidate: Users) => candidate.assessments)
  @JoinColumn({ name: 'candidate_id' })
  candidate: Users;

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

  @ManyToOne(() => Users, (hr: Users) => hr.assessments)
  @JoinColumn({ name: 'created_by' })
  created_by_hr: Users;

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
