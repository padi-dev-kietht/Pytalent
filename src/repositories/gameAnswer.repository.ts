import { Injectable } from '@nestjs/common';
import { GameAnswerEntity } from '../entities';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class GameAnswerRepository extends Repository<GameAnswerEntity> {
  constructor(private dataSource: DataSource) {
    super(GameAnswerEntity, dataSource.createEntityManager());
  }
}
