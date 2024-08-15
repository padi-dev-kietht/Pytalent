import { DataSource, Repository } from 'typeorm';
import { MemoryGameEntity } from '../entities';
import { Injectable } from '@nestjs/common';

@Injectable()
export class MemoryGameRepository extends Repository<MemoryGameEntity> {
  constructor(private dataSource: DataSource) {
    super(MemoryGameEntity, dataSource.createEntityManager());
  }
}
