import {
  Body,
  Controller,
  Delete,
  Patch,
  Post,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../../../shared/guards/jwt-auth.guard';
import { AuthorizationGuard } from '../../../shared/guards/authorization.guard';
import { RoleEnum } from '../../../common/enum/role.enum';
import { CreateAssessmentsDto } from '../dto/create-assessments.dto';
import { AssessmentService } from '../services/assessment.service';
import { BaseController } from '../../app/base.controller';
import { Response } from 'express';

@Controller('hr')
export class AssessmentController extends BaseController {
  constructor(private assessmentService: AssessmentService) {
    super();
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
