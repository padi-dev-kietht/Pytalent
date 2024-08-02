import { Controller, Post, Body, Res, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginDto } from '@modules/auth/dto/login.dto';
import { BaseController } from '@modules/app/base.controller';
import { Response } from 'express';
import { CustomizeException } from '@exception/customize.exception';
import { UsersService } from '@modules/users/services/users.service';
import { logger } from '@logs/app.log';
import { HttpStatus } from '@nestjs/common/enums/http-status.enum';

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
      await this.userService.checkOrCreateHr(loginDto);
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
