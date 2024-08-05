import { BaseEntity, Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
export class Questions extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar' })
  statement_one: string;

  @Column({ type: 'varchar' })
  statement_two: string;

  @Column({ type: 'varchar' })
  conclusion: string;

  @Column({ type: 'boolean' })
  is_conclusion_correct: boolean;
}
