import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { Assessments } from './assessments.entity';
import { Users } from './users.entity';
import { GameResult } from './game_result.entity';
import { GameTypeEnum } from '../common/enum/game-type.enum';
import { GameAnswer } from './game_answer.entity';

@Entity()
export class Games extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  game_type: GameTypeEnum;

  @Column({ type: 'text' })
  description: string;

  //Associations
  @OneToMany(() => GameResult, (result: GameResult) => result.game, {
    cascade: true,
  })
  game_results: GameResult[];

  @OneToMany(() => GameAnswer, (answer: GameAnswer) => answer.game, {
    cascade: true,
  })
  game_answers: GameAnswer[];

  @ManyToMany(
    () => Assessments,
    (assessment: Assessments) => assessment.games,
    { cascade: true },
  )
  assessments: Assessments[];

  @ManyToMany(() => Users, (hr: Users) => hr.games, { cascade: true })
  hrs: Users[];
}
