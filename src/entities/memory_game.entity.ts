import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { BaseEntity } from './base.entity';
import { GameAnswer } from './game_answer.entity';

@Entity()
export class MemoryGame extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'integer' })
  level: number;

  @Column({ type: 'integer' })
  number_of_patterns: number;

  @Column({ type: 'integer' })
  display_time: number;

  @Column({ type: 'integer' })
  input_time: number;

  @Column({ type: 'text' })
  patterns: string;

  @Column({ type: 'integer', default: 1 })
  order: number;

  // Associations

  @OneToMany(() => GameAnswer, (answer: GameAnswer) => answer.level, {
    cascade: true,
  })
  game_answers: GameAnswer[];
}
