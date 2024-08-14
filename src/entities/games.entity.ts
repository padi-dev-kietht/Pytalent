import {
  Column,
  Entity,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { Assessments } from './assessments.entity';
import { AssessmentsResult } from './assessments_result.entity';
import { Users } from './users.entity';
import { GameResult } from './game_result.entity';
import { GameTypeEnum } from '../common/enum/game-type.enum';

@Entity()
export class Games extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum' })
  game_type: GameTypeEnum;

  @Column({ type: 'text' })
  description: string;

  //Associations
  @OneToMany(
    () => AssessmentsResult,
    (result: AssessmentsResult) => result.game,
  )
  assessment_results: AssessmentsResult[];

  @OneToMany(() => GameResult, (result: GameResult) => result.game)
  game_results: GameResult[];

  @ManyToMany(() => Assessments, (assessment: Assessments) => assessment.games)
  assessments: Assessments[];

  @ManyToMany(() => Users, (hr: Users) => hr.games)
  hrs: Users[];
}
