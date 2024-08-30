import { forwardRef, Inject, Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { GamesService } from './game.service';
import { GameAnswerRepository } from '../repositories/gameAnswer.repository';
import { GameQuestionsRepository } from '../repositories/gameQuestion.repository';

@Injectable()
export class GameCronService {
  private cronEnabled = false;

  constructor(
    private readonly gameAnswerRepository: GameAnswerRepository,
    private readonly gameQuestionsRepository: GameQuestionsRepository,
    @Inject(forwardRef(() => GamesService))
    private readonly gamesService: GamesService,
  ) {}

  @Cron(CronExpression.EVERY_30_SECONDS)
  async handleGameTimeouts() {
    if (!this.cronEnabled) {
      return;
    }

    const timedOutGames = await this.findTimedOutGames();
    for (const game of timedOutGames) {
      await this.gamesService.endGame(
        game.gameId,
        game.assessmentId,
        game.candidateId,
      );
    }
  }

  private async findTimedOutGames() {
    const gameQuestion = await this.gameQuestionsRepository.findOne({
      where: { order: 1 },
    });

    const gameAnswer = await this.gameAnswerRepository.findOne({
      where: { question_id: gameQuestion.question_id },
      relations: ['game', 'assessment', 'candidate'],
    });

    const gameStartedTimer = new Date(
      gameAnswer.created_at.getTime() - gameAnswer.time_taken * 1000,
    );
    const now = Date.now();
    const timeDiff = now - gameStartedTimer.getTime();
    if (timeDiff > gameAnswer.total_time * 1000) {
      return [
        {
          gameId: gameAnswer.game_id,
          assessmentId: gameAnswer.assessment_id,
          candidateId: gameAnswer.candidate_id,
        },
      ];
    }
    return [];
  }

  enableCron() {
    this.cronEnabled = true;
  }

  disableCron() {
    this.cronEnabled = false;
  }
}
