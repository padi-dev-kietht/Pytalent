import { Module } from '@nestjs/common';
import { UsersService } from './services/users.service';
import { UsersRepository } from '@modules/users/repositories/user.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersEntity } from '@entities/index';
import { UsersAdminController } from '@modules/users/controllers/users.admin.controller';
import { UsersHrController } from './controllers/users.hr.controller';
import { UsersCandidateController } from './controllers/users.candidate.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UsersEntity])],
  controllers: [
    UsersAdminController,
    UsersCandidateController,
    UsersHrController,
  ],
  providers: [UsersService, UsersRepository],
  exports: [UsersService, UsersRepository],
})
export class UsersModule {}
