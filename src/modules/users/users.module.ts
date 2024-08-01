import { Module } from '@nestjs/common';
import { UsersService } from './services/users.service';
import { UsersSellerController } from './controllers/users.seller.controller';
import { UsersMemberController } from '@modules/users/controllers/users.member.controller';
import { UsersRepository } from '@modules/users/repositories/user.repository';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersEntity } from '@entities/index';
import { UsersAdminController } from '@modules/users/controllers/users.admin.controller';

@Module({
  imports: [TypeOrmModule.forFeature([UsersEntity])],
  controllers: [
    UsersSellerController,
    UsersAdminController,
    UsersMemberController,
  ],
  providers: [UsersService, UsersRepository],
  exports: [UsersService, UsersRepository],
})
export class UsersModule {}
