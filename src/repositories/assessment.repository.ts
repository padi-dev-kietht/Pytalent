import { Injectable } from '@nestjs/common';
import { AssessmentsEntity } from '../entities';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class AssessmentRepository extends Repository<AssessmentsEntity> {
  constructor(private dataSource: DataSource) {
    super(AssessmentsEntity, dataSource.createEntityManager());
  }

  async findAllAssessments(): Promise<any> {
    return await this.find();
  }
}
