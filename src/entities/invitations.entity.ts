import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { BaseEntity } from './base.entity';
import { InvitationStatusEnum } from '../common/enum/invitation-status.enum';
import { Users } from './users.entity';
import { Assessments } from './assessments.entity';

@Entity()
export class Invitations extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  status: InvitationStatusEnum;

  @Column({ type: 'int' })
  assessment_id: number;

  @Column({ type: 'int' })
  candidate_id: number;

  // Associations
  @ManyToOne(() => Users, (user: Users) => user.invitations)
  @JoinColumn({ name: 'candidate_id' })
  user: Users;

  @ManyToOne(
    () => Assessments,
    (assessment: Assessments) => assessment.invitations,
  )
  @JoinColumn({ name: 'assessment_id' })
  assessment: Assessments;
}
