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
import { Response } from 'express';
import { CreateUserDto } from '../dtos/create-user.dto';
import { BaseController } from './base.controller';
import { AssessmentService } from '../services/assessment.service';
import { UsersService } from '../services/users.service';
import { AuthorizationGuard } from '../shared/guards/authorization.guard';
import { JwtAuthGuard } from '../shared/guards/jwt-auth.guard';
import { RoleEnum } from '../common/enum/role.enum';

@Controller('admin/users')
export class UsersAdminController extends BaseController {
  constructor(
    private readonly assessmentService: AssessmentService,
    private readonly usersService: UsersService,
  ) {
    super();
  }

  // Adding games to a HR
  @Post('/hr/games/add')
  @UseGuards(JwtAuthGuard, new AuthorizationGuard([RoleEnum.ADMIN]))
  async addGamesToHr(@Res() res: Response, @Request() req) {
    await this.usersService.addGamesToHr(req.body.id, req.body.gameIds);
    return this.successResponse(
      {
        message: 'Success',
        data: {
          hr_id: req.body.id,
          gameIds: req.body.gameIds,
        },
      },
      res,
    );
  }

  // Creating a HR
  @Post('/hr/create')
  @UseGuards(JwtAuthGuard, new AuthorizationGuard([RoleEnum.ADMIN]))
  async create(@Body() createUserDto: CreateUserDto, @Res() res: Response) {
    try {
      await this.usersService.checkOrCreateHr(createUserDto);
      const { password, ...responseDto } = createUserDto;
      return this.successResponse(
        {
          message: 'Success',
          data: responseDto,
        },
        res,
      );
    } catch (e) {
      return this.errorsResponse(e.message, res);
    }
  }

  // Deleting a HR
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
