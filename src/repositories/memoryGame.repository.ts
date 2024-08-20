import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { MemoryGame } from '../entities/memory_game.entity';

@Injectable()
export class MemoryGameRepository extends Repository<MemoryGame> {
  constructor(private dataSource: DataSource) {
    super(MemoryGame, dataSource.createEntityManager());
  }
}
