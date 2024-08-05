import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { MemoryGameLevel } from './memory_game_level.entity';

@Entity()
export class MemoryGamePattern extends BaseEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'integer' })
  memory_game_level_id: number;

  @Column({ type: 'varchar' })
  pattern: string;

  @ManyToOne(() => MemoryGameLevel, (level: MemoryGameLevel) => level.patterns)
  level: MemoryGameLevel;
}
