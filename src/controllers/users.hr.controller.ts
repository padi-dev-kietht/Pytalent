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
import { UsersService } from '../services/users.service';
import { InviteCandidateDto } from '../dtos/invite-candidate.dto';

@Controller('hr')
export class UsersHrController extends BaseController {
  constructor(
    private usersService: UsersService,
    private assessmentService: AssessmentService,
  ) {
    super();
  }

  // Creating an assessment
  @Post('/assessments/create')
  @UseGuards(JwtAuthGuard, new AuthorizationGuard([RoleEnum.HR]))
  async createAssessment(
    @Body() createAssessmentDto: CreateAssessmentsDto,
    @Res() res: Response,
    @Request() req,
  ) {
    const userId = req.user.id;
    await this.assessmentService.checkOrCreateAssessment(
      createAssessmentDto,
      userId,
    );
    return this.successResponse(
      {
        message: 'Assessment created',
      },
      res,
    );
  }

  // Adding games to an assessment
  @Post('/assessments/:id/add-games')
  @UseGuards(JwtAuthGuard, new AuthorizationGuard([RoleEnum.HR]))
  async addGamesToAssessment(@Request() req, @Res() res: Response) {
    await this.usersService.addGamesToAssessment(
      req.params.id,
      req.body.gameIds,
      req.user.id,
    );
    return this.successResponse(
      {
        message: 'Games added to assessment',
      },
      res,
    );
  }

  // Deleting an assessment
  @Delete('/assessments/delete/:id')
  @UseGuards(JwtAuthGuard, new AuthorizationGuard([RoleEnum.HR]))
  async deleteAssessment(@Request() req, @Res() res: Response) {
    await this.assessmentService.deleteAssessment(
      Number(req.params.id),
      req.user.id,
    );
    return this.successResponse(
      {
        message: 'Assessment deleted',
      },
      res,
    );
  }

  // Archiving an assessment
  @Patch('/assessments/archive/:id')
  @UseGuards(JwtAuthGuard, new AuthorizationGuard([RoleEnum.HR]))
  async archiveAssessment(@Request() req, @Res() res: Response) {
    await this.assessmentService.archiveAssessment(
      Number(req.params.id),
      req.user.id,
    );
    return this.successResponse(
      {
        message: 'Assessment archived',
      },
      res,
    );
  }

  // Updating an assessment
  @Patch('/assessments/update/:id')
  @UseGuards(JwtAuthGuard, new AuthorizationGuard([RoleEnum.HR]))
  async updateAssessment(
    @Request() req,
    @Body() createAssessmentDto: CreateAssessmentsDto,
    @Res() res: Response,
  ) {
    await this.assessmentService.updateAssessment(
      Number(req.params.id),
      createAssessmentDto,
      req.user.id,
    );
    return this.successResponse(
      {
        message: 'Assessment updated',
      },
      res,
    );
  }

  //Inviting a candidate
  @Post('/invite')
  @UseGuards(JwtAuthGuard, new AuthorizationGuard([RoleEnum.HR]))
  async inviteCandidate(
    @Request() req,
    @Res() res: Response,
    @Body() inviteCandidateDto: InviteCandidateDto,
  ) {
    await this.usersService.inviteCandidate(inviteCandidateDto);
    return this.successResponse(
      {
        message: 'Candidate invited',
      },
      res,
    );
  }
}
