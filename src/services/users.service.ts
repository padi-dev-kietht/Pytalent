import { Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { Users } from '@entities/users.entity';
import { plainToClass } from 'class-transformer';
import {
  createUserInterface,
  FindUserInterface,
} from '@interfaces/user.interface';
import { RoleEnum } from '@enum/role.enum';
import { UsersRepository } from '../repositories/user.repository';
import { Games } from '../entities/games.entity';
import { GamesRepository } from '../repositories/game.repository';
import { Assessments } from '../entities/assessments.entity';
import { AssessmentsRepository } from '../repositories/assessment.repository';

@Injectable()
export class UsersService {
  constructor(
    private gamesRepository: GamesRepository,
    private usersRepository: UsersRepository,
    private assessmentsRepository: AssessmentsRepository,
  ) {}

  // ADMIN
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

  async addGamesToHr(id: number, gameIds: number[]) {
    const hr: Users = await this.usersRepository.findOne({
      where: { id, role: RoleEnum.HR },
    });
    if (!hr) {
      throw new NotFoundException('User not found');
    }

    const games: Games[] = await this.gamesRepository.findByIds(gameIds);
    if (!games.length) {
      throw new NotFoundException('Games not found');
    }

    hr.games = games;
    await this.usersRepository.save(hr);
  }

  // HR
  async addGamesToAssessment(id: number, gameIds: number[]) {
    const assessment: Assessments = await this.assessmentsRepository.findOne({
      where: { id },
    });
    if (!assessment) {
      throw new NotFoundException('Assessment not found');
    }

    const games: Games[] = await this.gamesRepository.findByIds(gameIds);
    if (!games.length) {
      throw new NotFoundException('Games not found');
    }

    assessment.games = games;
    await this.assessmentsRepository.save(assessment);
  }
}
