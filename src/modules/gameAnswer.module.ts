import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameAnswerEntity } from '../entities';
import { GameAnswerRepository } from '../repositories/gameAnswer.repository';

@Module({
  imports: [TypeOrmModule.forFeature([GameAnswerEntity])],
  providers: [GameAnswerRepository],
  exports: [GameAnswerRepository],
})
export class GameAnswerModule {}
