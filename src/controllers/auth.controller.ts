import { Controller, Post, Body, Res } from '@nestjs/common';
import { Response } from 'express';
import { CustomizeException } from '@exception/customize.exception';
import { logger } from '@logs/app.log';
import { HttpStatus } from '@nestjs/common/enums/http-status.enum';
import { AuthService } from '../services/auth.service';
import { BaseController } from './base.controller';
import { UsersService } from '../services/users.service';
import { LoginDto } from '../dtos/login.dto';

@Controller()
export class AuthController extends BaseController {
  constructor(
    private authService: AuthService,
    private userService: UsersService,
  ) {
    super();
  }

  @Post('login')
  async login(@Body() loginDto: LoginDto, @Res() res: Response) {
    try {
      // await this.userService.checkOrCreateHr(loginDto);
      const token = await this.authService.login(loginDto);

      return this.successResponse(
        {
          data: {
            token: token,
          },
        },
        res,
      );
    } catch (e) {
      logger.error('login errors: ' + e.message);
      throw new CustomizeException(
        e.message.toString(),
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
