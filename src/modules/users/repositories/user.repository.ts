import { Injectable } from '@nestjs/common';
import { DataSource, Repository } from 'typeorm';
import { UsersEntity } from '@entities/index';
import { Users } from '@entities/users.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersRepository extends Repository<UsersEntity> {
  constructor(private dataSource: DataSource) {
    super(UsersEntity, dataSource.createEntityManager());
  }

  async findAllUsers(): Promise<any> {
    return await this.find();
  }

  async validateUser(email: string, password: string): Promise<Users> {
    const user = await this.findOne({ where: { email: email } });
    if (!user) {
      return null;
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return null;
    }

    return user;
  }
}
