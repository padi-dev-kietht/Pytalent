import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MemoryGameLevel } from './memory_game_level.entity';
import { BaseEntity } from './base.entity';

@Entity()
export class MemoryGamePattern extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'integer' })
  memory_game_level_id: number;

  @Column({ type: 'varchar' })
  pattern: string;

  @ManyToOne(() => MemoryGameLevel, (level: MemoryGameLevel) => level.patterns)
  @JoinColumn({ name: 'memory_game_level_id' })
  level: MemoryGameLevel;
}
