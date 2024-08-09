import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { Assessments } from '../entities/assessments.entity';
import { AssessmentsRepository } from '../repositories/assessment.repository';
import { FindOrCreateAssessmentInterface } from '../shared/interfaces/assessment.interface';
import * as moment from 'moment';

@Injectable()
export class AssessmentService {
  constructor(private assessmentsRepository: AssessmentsRepository) {}

  async checkOrCreateAssessment(
    params: FindOrCreateAssessmentInterface,
    userId: number,
  ): Promise<Assessments> {
    let assessment: Assessments = await this.assessmentsRepository.findOne({
      where: { name: params.name },
    });
    const current = new Date();
    if (!assessment) {
      const paramCreate: FindOrCreateAssessmentInterface = plainToClass(
        Assessments,
        {
          name: params.name,
          description: params.description,
          start_date: params.start_date,
          end_date: params.end_date,
          is_archived: params.is_archived,
          created_by: userId,
        },
      );

      // Validation
      if (paramCreate.start_date > paramCreate.end_date) {
        throw new ConflictException('Start date must be before end date');
      }
      if (moment(paramCreate.start_date).toDate() < current) {
        throw new ConflictException('Start date must be in the future');
      }
      if (moment(paramCreate.end_date).toDate() < current) {
        throw new ConflictException('End date must be in the future');
      }

      // Create assessment
      assessment = await this.assessmentsRepository.create(paramCreate);
      await this.assessmentsRepository.save(assessment);
    }
    return assessment;
  }

  async getAllAssessments(): Promise<Assessments[]> {
    const assessments: Assessments[] = await this.assessmentsRepository.find();
    if (!assessments) {
      throw new Error('Assessments not found');
    }
    return assessments;
  }

  async getAssessmentById(id: number): Promise<Assessments> {
    const assessment: Assessments = await this.assessmentsRepository.findOne({
      where: { id },
    });
    if (!assessment) {
      throw new Error('Assessment not found');
    }
    return assessment;
  }

  async archiveAssessment(id: number) {
    const assessment: Assessments = await this.assessmentsRepository.findOne({
      where: { id },
    });
    if (assessment) {
      assessment.is_archived = true;
      await this.assessmentsRepository.save(assessment);
    } else {
      throw new NotFoundException('Assessment not found');
    }
  }

  async deleteAssessment(id: number) {
    const assessment: Assessments = await this.assessmentsRepository.findOne({
      where: { id },
    });
    if (assessment) {
      await this.assessmentsRepository.delete(id);
    } else {
      throw new NotFoundException('Assessment not found');
    }
  }
}
