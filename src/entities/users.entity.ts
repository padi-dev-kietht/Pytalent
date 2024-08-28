import 'reflect-metadata';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  Index,
  OneToMany,
  ManyToMany,
  JoinTable,
} from 'typeorm';
import { BaseEntity } from '@entities/base.entity';
import { RoleEnum } from '@enum/role.enum';
import { Invitations } from './invitations.entity';
import { Games } from './games.entity';
import { Token } from './token.entity';
import { GameResult } from './game_result.entity';
import { Assessments } from './assessments.entity';

@Entity()
export class Users extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  @Index({ unique: true })
  email: string;

  @Column({ nullable: true })
  password: string;

  @Column()
  role: RoleEnum;

  //Associations
  @OneToMany(() => Token, (token: Token) => token.user, { cascade: true })
  tokens: Token[];

  @OneToMany(() => Invitations, (invitation: Invitations) => invitation.user, {
    cascade: true,
  })
  invitations: Invitations[];

  @OneToMany(() => GameResult, (result: GameResult) => result.candidate, {
    cascade: true,
  })
  game_results: GameResult[];

  @OneToMany(
    () => Assessments,
    (assessment: Assessments) => assessment.created_by,
    { cascade: true },
  )
  assessments: Assessments[];

  @ManyToMany(
    () => Assessments,
    (assessment: Assessments) => assessment.candidates,
    { cascade: true },
  )
  @JoinTable({
    name: 'assessments_candidates',
    joinColumn: {
      name: 'candidate_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'assessment_id',
      referencedColumnName: 'id',
    },
  })
  assessments_candidates: Assessments[];

  @ManyToMany(() => Games, (game: Games) => game.hrs, { onDelete: 'CASCADE' })
  @JoinTable({
    name: 'hr_games',
    joinColumn: {
      name: 'user_id',
      referencedColumnName: 'id',
    },
    inverseJoinColumn: {
      name: 'game_id',
      referencedColumnName: 'id',
    },
  })
  games: Games[];
}
