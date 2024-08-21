import { Injectable } from '@nestjs/common';
import { GameQuestionsEntity } from '../entities';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class GameQuestionsRepository extends Repository<GameQuestionsEntity> {
  constructor(private dataSource: DataSource) {
    super(GameQuestionsEntity, dataSource.createEntityManager());
  }
}
