import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { Users } from '@entities/users.entity';
import { env } from '@env';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: env.jwt.secret,
      usernameField: 'email',
      passwordField: 'password',
    });
  }

  async validate(payload: any) {
    return plainToClass(Users, payload);
  }
}
