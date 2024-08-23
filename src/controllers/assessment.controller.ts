import { Controller, Get, Request, Res, UseGuards } from '@nestjs/common';
import { AssessmentService } from '../services/assessment.service';
import { BaseController } from './base.controller';
import { UsersService } from '../services/users.service';
import { Response } from 'express';
import { JwtAuthGuard } from '../shared/guards/jwt-auth.guard';
import { AuthorizationGuard } from '../shared/guards/authorization.guard';
import { RoleEnum } from '../common/enum/role.enum';

@Controller('assessments')
export class AssessmentController extends BaseController {
  constructor(
    private userService: UsersService,
    private assessmentService: AssessmentService,
  ) {
    super();
  }

  // Getting all assessments
  @Get()
  @UseGuards(
    JwtAuthGuard,
    new AuthorizationGuard([RoleEnum.HR, RoleEnum.ADMIN]),
  )
  async getAllAssessmentByHrId(@Res() res: Response, @Request() req) {
    const assessments = await this.assessmentService.getAllAssessmentByHrId(
      req.user.id,
    );
    return this.successResponse(
      {
        data: assessments,
      },
      res,
    );
  }

  // Getting an assessment by ID
  @Get('/:id')
  @UseGuards(
    JwtAuthGuard,
    new AuthorizationGuard([RoleEnum.HR, RoleEnum.ADMIN]),
  )
  async getAssessmentById(id: number, @Res() res: Response, @Request() req) {
    const assessment = await this.assessmentService.getAssessmentById(
      id,
      req.user.id,
    );
    return this.successResponse(
      {
        data: assessment,
      },
      res,
    );
  }

  @Get('/invite/:invitation_id')
  async addCandidateToAssessment(@Request() req, @Res() res: Response) {
    await this.userService.acceptInvitation(req.params.invitation_id);
    return this.successResponse(
      {
        message: 'You have successfully accepted the invitation',
      },
      res,
    );
  }
}
