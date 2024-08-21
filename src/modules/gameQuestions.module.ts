import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameQuestionsEntity } from '../entities';
import { GameQuestionsRepository } from '../repositories/gameQuestion.repository';

@Module({
  imports: [TypeOrmModule.forFeature([GameQuestionsEntity])],
  providers: [GameQuestionsRepository],
  exports: [GameQuestionsRepository],
})
export class GameQuestionsModule {}
