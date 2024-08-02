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

@Entity()
export class Assessments extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'longtext' })
  description: string;

  @Column({ type: 'datetime' })
  start_date: Date;

  @Column({ type: 'datetime' })
  end_date: Date;

  @Column({ type: 'int' })
  created_by: number;

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
