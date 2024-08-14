import { Module } from '@nestjs/common';
import { UsersService } from '../services/users.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import {
  GamesEntity,
  InvitationsEntity,
  TokenEntity,
  UsersEntity,
} from '@entities/index';
import { UsersAdminController } from '@controllers/users.admin.controller';
import { UsersHrController } from '../controllers/users.hr.controller';
import { UsersCandidateController } from '../controllers/users.candidate.controller';
import { UsersRepository } from '../repositories/user.repository';
import { AssessmentsModule } from './assessment.module';
import { GamesModule } from './game.module';
import { InvitationsModule } from './invitations.module';
import { MailService } from '../common/lib/mail/mail.lib';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      UsersEntity,
      TokenEntity,
      GamesEntity,
      InvitationsEntity,
    ]),
    AssessmentsModule,
    GamesModule,
    InvitationsModule,
  ],
  controllers: [
    UsersAdminController,
    UsersCandidateController,
    UsersHrController,
  ],
  providers: [UsersService, UsersRepository, MailService],
  exports: [UsersService, UsersRepository],
})
export class UsersModule {}
