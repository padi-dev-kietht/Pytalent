import {
  Body,
  Controller,
  Post,
  Res,
  UseGuards,
  Request,
  Delete,
} from '@nestjs/common';
import { JwtAuthGuard } from '@guards/jwt-auth.guard';
import { CreateUserDto } from '@modules/users/dto/create-user.dto';
import { Response } from 'express';
import { UsersService } from '@modules/users/services/users.service';
import { BaseController } from '@modules/app/base.controller';
import { AuthorizationGuard } from '@guards/authorization.guard';
import { RoleEnum } from '@enum/role.enum';

@Controller('admin/users')
export class UsersAdminController extends BaseController {
  constructor(private readonly usersService: UsersService) {
    super();
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
}
