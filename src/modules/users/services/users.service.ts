import { Injectable } from '@nestjs/common';
import { UsersRepository } from '@modules/users/repositories/user.repository';
import * as bcrypt from 'bcrypt';
import { Users } from '@entities/users.entity';
import { plainToClass } from 'class-transformer';
import {
  createUserInterface,
  FindUserInterface,
} from '@interfaces/user.interface';
import { RoleEnum } from '@enum/role.enum';

@Injectable()
export class UsersService {
  constructor(private usersRepository: UsersRepository) {}

  async checkOrCreateUser(params: FindUserInterface) {
    let user: Users = await this.usersRepository.findOne({
      where: {
        email: params.email,
      },
    });
    if (!user) {
      const paramCreate: createUserInterface = plainToClass(Users, {
        email: params.email,
        password: await bcrypt.hash(params.password, 10),
        role: RoleEnum.CANDIDATE,
      });
      user = await this.usersRepository.create(paramCreate);
    }
    return user;
  }
}
