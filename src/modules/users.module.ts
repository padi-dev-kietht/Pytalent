import { Module } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GamesEntity, TokenEntity, UsersEntity } from '@entities/index';
import { UsersAdminController } from '@controllers/users.admin.controller';
import { UsersHrController } from '../controllers/users.hr.controller';
import { UsersCandidateController } from '../controllers/users.candidate.controller';
import { UsersRepository } from '../repositories/user.repository';
import { AssessmentsModule } from './assessment.module';
import { GamesModule } from './game.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([UsersEntity, TokenEntity, GamesEntity]),
    AssessmentsModule,
    GamesModule,
  ],
  controllers: [
    UsersAdminController,
    UsersCandidateController,
    UsersHrController,
  ],
  providers: [UsersService, UsersRepository],
  exports: [UsersService, UsersRepository],
})
export class UsersModule {}
