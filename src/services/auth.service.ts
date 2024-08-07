import { Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CustomizeException } from '@exception/customize.exception';
import { I18nService } from 'nestjs-i18n';
import { UsersService } from './users.service';
import { UsersRepository } from '../repositories/user.repository';

@Injectable()
export class AuthService {
  constructor(
    private userRepository: UsersRepository,
    private userService: UsersService,
    private jwtService: JwtService,
    private readonly i18n: I18nService,
  ) {}

  async login(params: any) {
    const { email, password } = params;
    const user = await this.userRepository.validateUser(email, password);
    if (user) {
      return this.jwtService.sign(JSON.parse(JSON.stringify(user)));
    }
    throw new CustomizeException(
      this.i18n.t('message.IS_INCORRECT_EMAIL_OR_PASSWORD'),
    );
  }
}
