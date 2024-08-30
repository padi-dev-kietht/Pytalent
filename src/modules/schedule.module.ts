import { forwardRef, Module } from '@nestjs/common';
import { ScheduleModule } from '@nestjs/schedule';
import { GameCronService } from '../services/schedule.service';
import { GameAnswerModule } from './gameAnswer.module';
import { GameQuestionsModule } from './gameQuestions.module';
import { GamesModule } from './game.module';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    forwardRef(() => GameAnswerModule),
    forwardRef(() => GameQuestionsModule),
    forwardRef(() => GamesModule),
  ],
  providers: [GameCronService],
  exports: [GameCronService],
})
export class GameCronModule {}
