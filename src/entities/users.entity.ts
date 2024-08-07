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

  @Column()
  password: string;

  @Column()
  role: RoleEnum;

  //Associations
  @OneToMany(() => Token, (token: Token) => token.user)
  tokens: Token[];

  @OneToMany(() => Invitations, (invitation: Invitations) => invitation.user)
  invitations: Invitations[];

  @OneToMany(() => GameResult, (result: GameResult) => result.candidate)
  game_results: GameResult[];

  @OneToMany(
    () => Assessments,
    (assessment: Assessments) => assessment.created_by,
  )
  assessments: Assessments[];

  @ManyToMany(() => Games, (game: Games) => game.hrs)
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
