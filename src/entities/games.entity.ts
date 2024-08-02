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

  @Column({ type: 'longtext' })
  description: string;

  //Associations
  @OneToMany(
    () => AssessmentsResult,
    (result: AssessmentsResult) => result.game,
  )
  results: AssessmentsResult[];

  @ManyToMany(() => Assessments, (assessment: Assessments) => assessment.games)
  @JoinTable()
  assessments: Assessments[];

  @ManyToMany(() => Users, (hr: Users) => hr.games)
  @JoinTable()
  hrs: Users[];
}
