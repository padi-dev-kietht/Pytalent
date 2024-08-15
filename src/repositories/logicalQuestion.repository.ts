import { Injectable } from '@nestjs/common';
import { LogicalQuestionsEntity } from '../entities';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class LogicalQuestionsRepository extends Repository<LogicalQuestionsEntity> {
  constructor(private dataSource: DataSource) {
    super(LogicalQuestionsEntity, dataSource.createEntityManager());
  }
}
