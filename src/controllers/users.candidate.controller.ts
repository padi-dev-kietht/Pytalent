import { Body, Controller, Post, Request, Res } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { BaseController } from './base.controller';
import { CreateUserDto } from '../dtos/create-user.dto';
import { Response } from 'express';

@Controller('candidates')
export class UsersCandidateController extends BaseController {
  constructor(private readonly usersService: UsersService) {
    super();
  }

  @Post('/create')
  async createCandidate(
    @Res() res: Response,
    @Request() req,
    @Body() createUserDto: CreateUserDto,
  ) {
    await this.usersService.checkOrCreateCandidate(createUserDto);
    return this.successResponse(
      {
        message: 'Success',
      },
      res,
    );
  }
}
