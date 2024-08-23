import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GamesEntity } from '../entities';
import { GamesController } from '../controllers/game.controller';
import { GamesService } from '../services/game.service';
import { GamesRepository } from '../repositories/game.repository';
import { GameAnswerModule } from './gameAnswer.module';
import { LogicalQuestionsModule } from './logicalQuestion.module';
import { MemoryGameModule } from './memoryGame.module';
import { GameQuestionsModule } from './gameQuestions.module';
import { AssessmentsModule } from './assessment.module';
import { GameResultModule } from './gameResult.module';
import { InvitationsModule } from './invitations.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([GamesEntity]),
    GameAnswerModule,
    LogicalQuestionsModule,
    MemoryGameModule,
    GameQuestionsModule,
    forwardRef(() => AssessmentsModule),
    GameResultModule,
    InvitationsModule,
  ],
  controllers: [GamesController],
  providers: [GamesService, GamesRepository],
  exports: [GamesService, GamesRepository],
})
export class GamesModule {}
