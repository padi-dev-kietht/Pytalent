import {
  Column,
  Entity,
  JoinTable,
  ManyToMany,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { Assessments } from './assessments.entity';
import { AssessmentsResult } from './assessments_result.entity';
import { Users } from './users.entity';

@Entity()
export class Games extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  name: string;

  @Column({ type: 'text' })
  description: string;

  //Associations
  @OneToMany(
    () => AssessmentsResult,
    (result: AssessmentsResult) => result.game,
  )
  results: AssessmentsResult[];

  @ManyToMany(() => Assessments, (assessment: Assessments) => assessment.games)
  assessments: Assessments[];

  @ManyToMany(() => Users, (hr: Users) => hr.games)
  hrs: Users[];
}
