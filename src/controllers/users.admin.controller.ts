import {
  Body,
  Controller,
  Post,
  Res,
  UseGuards,
  Request,
  Delete,
  Get,
} from '@nestjs/common';
import { JwtAuthGuard } from '@guards/jwt-auth.guard';
import { Response } from 'express';
import { UsersService } from '@services/users.service';
import { AuthorizationGuard } from '@guards/authorization.guard';
import { RoleEnum } from '@enum/role.enum';
import { CreateUserDto } from '../dtos/create-user.dto';
import { BaseController } from './base.controller';
import { AssessmentService } from '../services/assessment.service';

@Controller('admin/users')
export class UsersAdminController extends BaseController {
  constructor(
    private readonly assessmentService: AssessmentService,
    private readonly usersService: UsersService,
  ) {
    super();
  }

  @Post('/hr/games/add')
  @UseGuards(JwtAuthGuard, new AuthorizationGuard([RoleEnum.ADMIN]))
  async addGamesToHr(@Res() res: Response, @Request() req) {
    await this.usersService.addGamesToHr(req.body.id, req.body.gameIds);
    return this.successResponse(
      {
        message: 'Success',
      },
      res,
    );
  }

  @Post('/hr/create')
  @UseGuards(JwtAuthGuard, new AuthorizationGuard([RoleEnum.ADMIN]))
  async create(
    @Request() req,
    @Body() createUserDto: CreateUserDto,
    @Res() res: Response,
  ) {
    await this.usersService.checkOrCreateHr(createUserDto);
    return this.successResponse(
      {
        message: 'Success',
      },
      res,
    );
  }

  @Delete('/hr/delete/:id')
  @UseGuards(JwtAuthGuard, new AuthorizationGuard([RoleEnum.ADMIN]))
  async delete(@Request() req, @Res() res: Response) {
    await this.usersService.deleteHr(Number(req.params.id));
    return this.successResponse(
      {
        message: 'Success',
      },
      res,
    );
  }

  @Get('/hr/assessments')
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
}
