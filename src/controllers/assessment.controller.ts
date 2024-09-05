import {
  Body,
  Controller,
  Get,
  Post,
  Request,
  Res,
  UseGuards,
} from '@nestjs/common';
import { AssessmentService } from '../services/assessment.service';
import { BaseController } from './base.controller';
import { UsersService } from '../services/users.service';
import { Response } from 'express';
import { JwtAuthGuard } from '../shared/guards/jwt-auth.guard';
import { AuthorizationGuard } from '../shared/guards/authorization.guard';
import { RoleEnum } from '../common/enum/role.enum';
import { GamesService } from '../services/game.service';

@Controller('assessments')
export class AssessmentController extends BaseController {
  constructor(
    private userService: UsersService,
    private assessmentService: AssessmentService,
    private gameService: GamesService,
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

  // Getting game result in an assessment
  @Get('/:id/result')
  @UseGuards(
    JwtAuthGuard,
    new AuthorizationGuard([RoleEnum.HR, RoleEnum.ADMIN]),
  )
  async getGameResultByAssessmentId(
    id: number,
    @Res() res: Response,
    @Request() req,
  ) {
    const gameResults = await this.gameService.getGameResultByAssessmentId(
      id,
      req.user.id,
    );
    return this.successResponse({ data: gameResults }, res);
  }

  @Post('/invite/:invitation_id/authenticate')
  async acceptInvitation(
    @Request() req,
    @Res() res: Response,
    @Body() body: { email: string },
  ) {
    const data = await this.userService.joinAssessment(
      body.email,
      req.params.invitation_id,
    );
    return this.successResponse(
      {
        message: 'You joined the assessment',
        data,
      },
      res,
    );
  }

  @Get('/invite/:invitation_id')
  async addCandidateToAssessment(@Request() req, @Res() res: Response) {
    return this.successResponse(
      {
        message:
          'You have successfully accepted the invitation, please input your email to join the assessment',
      },
      res,
    );
  }
}
