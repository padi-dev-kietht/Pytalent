import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Users } from '@entities/users.entity';
import { plainToClass } from 'class-transformer';
import {
  createUserInterface,
  FindUserInterface,
} from '@interfaces/user.interface';
import { RoleEnum } from '@enum/role.enum';
import { UsersRepository } from '../repositories/user.repository';

@Injectable()
export class UsersService {
  constructor(private usersRepository: UsersRepository) {}

  async checkOrCreateHr(params: FindUserInterface): Promise<Users> {
    let user: Users = await this.usersRepository.findOne({
      where: {
        email: params.email,
      },
    });
    if (!user) {
      const paramCreate: createUserInterface = plainToClass(Users, {
        email: params.email,
        password: await bcrypt.hash(params.password, 10),
        role: RoleEnum.HR,
      });
      user = await this.usersRepository.create(paramCreate);
      await this.usersRepository.save(user);
    }
    return user;
  }

  async deleteHr(id: number) {
    const user: Users = await this.usersRepository.findOne({ where: { id } });
    if (user) {
      await this.usersRepository.delete(id);
    } else {
      throw new Error('User not found');
    }
  }
}
