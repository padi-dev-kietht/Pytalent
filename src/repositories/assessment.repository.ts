import { Injectable } from '@nestjs/common';
import { AssessmentsEntity } from '../entities';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class AssessmentsRepository extends Repository<AssessmentsEntity> {
  constructor(private dataSource: DataSource) {
    super(AssessmentsEntity, dataSource.createEntityManager());
  }
}
