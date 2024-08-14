import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InvitationsRepository } from '../repositories/invitation.repository';
import { InvitationsEntity } from '../entities';

@Module({
  imports: [TypeOrmModule.forFeature([InvitationsEntity])],
  providers: [InvitationsRepository],
  exports: [InvitationsRepository],
})
export class InvitationsModule {}
