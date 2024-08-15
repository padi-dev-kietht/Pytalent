import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LogicalQuestionsEntity } from '../entities';
import { LogicalQuestionsRepository } from '../repositories/logicalQuestion.repository';

@Module({
  imports: [TypeOrmModule.forFeature([LogicalQuestionsEntity])],
  providers: [LogicalQuestionsRepository],
  exports: [LogicalQuestionsRepository],
})
export class LogicalQuestionsModule {}
