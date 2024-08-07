import {
  Body,
  Controller,
  Delete,
  Get,
  Patch,
  Post,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { JwtAuthGuard } from '../shared/guards/jwt-auth.guard';
import { RoleEnum } from '../common/enum/role.enum';
import { AuthorizationGuard } from '../shared/guards/authorization.guard';
import { CreateAssessmentsDto } from '../dtos/create-assessments.dto';
import { AssessmentService } from '../services/assessment.service';
import { BaseController } from './base.controller';

@Controller('hr')
export class UsersHrController extends BaseController {
  constructor(private assessmentService: AssessmentService) {
    super();
  }
  @Get('/assessments')
  @UseGuards(JwtAuthGuard, new AuthorizationGuard([RoleEnum.HR]))
  async getAllAssessments(@Res() res: Response) {
    const assessments = await this.assessmentService.getAllAssessments();
    return this.successResponse(
      {
        data: assessments,
      },
      res,
    );
  }

  @Get('/assessments/:id')
  @UseGuards(JwtAuthGuard, new AuthorizationGuard([RoleEnum.HR]))
  async getAssessmentById(id: number, @Res() res: Response) {
    const assessment = await this.assessmentService.getAssessmentById(id);
    return this.successResponse(
      {
        data: assessment,
      },
      res,
    );
  }

  @Post('/assessments/create')
  @UseGuards(JwtAuthGuard, new AuthorizationGuard([RoleEnum.HR]))
  async createAssessment(
    @Body() createAssessmentDto: CreateAssessmentsDto,
    @Res() res: Response,
  ) {
    await this.assessmentService.checkOrCreateAssessment(createAssessmentDto);
    return this.successResponse(
      {
        message: 'Assessment created',
      },
      res,
    );
  }

  @Delete('/assessments/delete/:id')
  @UseGuards(JwtAuthGuard, new AuthorizationGuard([RoleEnum.HR]))
  async deleteAssessment(@Request() req, @Res() res: Response) {
    await this.assessmentService.deleteAssessment(Number(req.params.id));
    return this.successResponse(
      {
        message: 'Assessment deleted',
      },
      res,
    );
  }

  @Patch('/assessments/archive/:id')
  @UseGuards(JwtAuthGuard, new AuthorizationGuard([RoleEnum.HR]))
  async archiveAssessment(@Request() req, @Res() res: Response) {
    await this.assessmentService.archiveAssessment(Number(req.params.id));
    return this.successResponse(
      {
        message: 'Assessment archived',
      },
      res,
    );
  }
}
