import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LogicalQuestionsGameService } from '../services/logicalQuestionsGame.service';
import { GamesModule } from './game.module';
import { GamesEntity } from '../entities';
import { GameQuestionsModule } from './gameQuestions.module';
import { LogicalQuestionsModule } from './logicalQuestion.module';
import { GameAnswerModule } from './gameAnswer.module';
import { AssessmentsModule } from './assessment.module';
import { UsersModule } from './users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([GamesEntity]),
    GameQuestionsModule,
    LogicalQuestionsModule,
    GameAnswerModule,
    forwardRef(() => UsersModule),
    forwardRef(() => GamesModule),
    forwardRef(() => AssessmentsModule),
  ],
  providers: [LogicalQuestionsGameService],
  exports: [LogicalQuestionsGameService],
})
export class LogicalQuestionsGameModule {}
