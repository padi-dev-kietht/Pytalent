import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { InvitationStatusEnum } from '../common/enum/invitation-status.enum';

@Entity()
export class Invitations extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'enum' })
  status: InvitationStatusEnum;

  @Column({ type: 'int' })
  assessment_id: number;

  @Column({ type: 'int' })
  candidate_id: number;
}
