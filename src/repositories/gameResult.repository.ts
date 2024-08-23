import { Injectable } from '@nestjs/common';
import { GameResultEntity } from '../entities';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class GameResultRepository extends Repository<GameResultEntity> {
  constructor(private dataSource: DataSource) {
    super(GameResultEntity, dataSource.createEntityManager());
  }
}
