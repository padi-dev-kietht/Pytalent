import { Injectable } from '@nestjs/common';
import { Assessments } from '../../../entities/assessments.entity';
import { AssessmentRepository } from '../../assessments/repositories/assessment.repository';
import { plainToClass } from 'class-transformer';
import { FindOrCreateAssessmentInterface } from '../../../shared/interfaces/assessment.interface';

@Injectable()
export class AssessmentService {
  constructor(private assessmentsRepository: AssessmentRepository) {}

  async checkOrCreateAssessment(
    params: FindOrCreateAssessmentInterface,
  ): Promise<Assessments> {
    let assessment: Assessments = await this.assessmentsRepository.findOne({
      where: { name: params.name },
    });
    if (!assessment) {
      const paramCreate: FindOrCreateAssessmentInterface = plainToClass(
        Assessments,
        {
          name: params.name,
          description: params.description,
          start_date: params.start_date,
          end_date: params.end_date,
          is_archived: params.is_archived,
          created_by: params.created_by,
        },
      );
      assessment = await this.assessmentsRepository.create(paramCreate);
      await this.assessmentsRepository.save(assessment);
    }
    return;
  }

  async archiveAssessment(id: number) {
    const assessment: Assessments = await this.assessmentsRepository.findOne({
      where: { id },
    });
    if (assessment) {
      assessment.is_archived = true;
      await this.assessmentsRepository.save(assessment);
    }
  }

  async deleteAssessment(id: number) {
    const assessment: Assessments = await this.assessmentsRepository.findOne({
      where: { id },
    });
    if (assessment) {
      await this.assessmentsRepository.delete(id);
    }
  }
}
