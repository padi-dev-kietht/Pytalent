import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AssessmentsEntity } from '../entities';
import { AssessmentsRepository } from '../repositories/assessment.repository';
import { AssessmentController } from '../controllers/assessment.controller';
import { AssessmentService } from '../services/assessment.service';

@Module({
  imports: [TypeOrmModule.forFeature([AssessmentsEntity])],
  controllers: [AssessmentController],
  providers: [AssessmentService, AssessmentsRepository],
  exports: [AssessmentService, AssessmentsRepository],
})
export class AssessmentsModule {}
