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

  async validateAssessment(assessment_id: number, hr_id: number) {
    const assessment = await this.assessmentsRepository.findOne({
      relations: ['created_by_hr'],
      where: { id: assessment_id },
    });
    if (!assessment) {
      throw new NotFoundException('Assessment not found');
    }
    if (assessment.created_by !== hr_id) {
      throw new ConflictException(
        'You are not allowed to archive or delete this assessment',
      );
    }
  }

  async validateAssessmentById(id: number): Promise<void> {
    const assessment: Assessments = await this.assessmentsRepository.findOne({
      where: { id },
    });
    if (!assessment) {
      throw new Error('Assessment not found');
    }
    if (assessment.is_archived) {
      throw new NotFoundException('Assessment is archived');
    }
  }

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
      assessment = this.assessmentsRepository.create(paramCreate);
      await this.assessmentsRepository.save(assessment);
    }
    return assessment;
  }

  async archiveAssessment(id: number, hr_id: number) {
    await this.validateAssessment(id, hr_id);

    const assessment = await this.getAssessmentById(id);
    assessment.is_archived = true;

    await this.assessmentsRepository.save(assessment);
  }

  async deleteAssessment(id: number, hr_id: number) {
    await this.validateAssessment(id, hr_id);
    await this.assessmentsRepository.delete(id);
  }

  async updateAssessment(
    id: number,
    params: FindOrCreateAssessmentInterface,
    hr_id: number,
  ) {
    await this.validateAssessment(id, hr_id);
    const assessment = await this.getAssessmentById(id);

    const paramUpdate: FindOrCreateAssessmentInterface = plainToClass(
      Assessments,
      {
        name: params.name ?? assessment.name,
        description: params.description ?? assessment.description,
        start_date: params.start_date,
        end_date: params.end_date,
        is_archived: params.is_archived,
        created_by: hr_id,
      },
    );

    // Validation
    if (paramUpdate.start_date > paramUpdate.end_date) {
      throw new ConflictException('Start date must be before end date');
    }
    if (moment(paramUpdate.start_date).toDate() < new Date()) {
      throw new ConflictException('Start date must be in the future');
    }
    if (moment(paramUpdate.end_date).toDate() < new Date()) {
      throw new ConflictException('End date must be in the future');
    }

    await this.assessmentsRepository.update(id, paramUpdate);
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
    return assessment;
  }

  async getAllAssessmentByHrId(hr_id: number): Promise<Assessments[]> {
    const assessments: Assessments[] = await this.assessmentsRepository.find({
      where: { created_by: hr_id },
    });
    if (!assessments) {
      throw new Error('Assessments not found');
    }
    return assessments;
  }
}
