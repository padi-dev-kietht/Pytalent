import { Controller, Get, Post, Request, Res } from '@nestjs/common';
import { AssessmentService } from '../services/assessment.service';
import { BaseController } from './base.controller';
import { UsersService } from '../services/users.service';
import { Response } from 'express';

@Controller('assessments')
export class AssessmentController extends BaseController {
  constructor(
    private userService: UsersService,
    private assessmentService: AssessmentService,
  ) {
    super();
  }
  @Get('/invite/:invitation_id')
  async addCandidateToAssessment(@Request() req, @Res() res: Response) {
    await this.userService.acceptInvitation(req.params.invitation_id);
    return this.successResponse(
      {
        message: 'Candidate added to assessment',
      },
      res,
    );
  }
}
