import { Module } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TokenEntity, UsersEntity } from '@entities/index';
import { UsersAdminController } from '@controllers/users.admin.controller';
import { UsersHrController } from '../controllers/users.hr.controller';
import { UsersCandidateController } from '../controllers/users.candidate.controller';
import { UsersRepository } from '../repositories/user.repository';

@Module({
  imports: [TypeOrmModule.forFeature([UsersEntity, TokenEntity])],
  controllers: [
    UsersAdminController,
    UsersCandidateController,
    UsersHrController,
  ],
  providers: [UsersService, UsersRepository],
  exports: [UsersService, UsersRepository],
})
export class UsersModule {}
