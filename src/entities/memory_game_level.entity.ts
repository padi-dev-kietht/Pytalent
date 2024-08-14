import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { MemoryGamePattern } from './memory_game_pattern.entity';
import { BaseEntity } from './base.entity';
import { GameAnswer } from './game_answer.entity';

@Entity()
export class MemoryGameLevel extends BaseEntity {
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

  // Associations
  @OneToMany(
    () => MemoryGamePattern,
    (pattern: MemoryGamePattern) => pattern.level,
  )
  patterns: MemoryGamePattern[];

  @OneToMany(() => GameAnswer, (answer: GameAnswer) => answer.level)
  game_answers: GameAnswer[];
}
