import { Body, Controller, Param, Post, Res } from '@nestjs/common';

import { BaseController } from './base.controller';
import { GamesService } from '../services/game.service';
import { GameAnswer } from '../entities/game_answer.entity';
import { Response } from 'express';
import { LogicalQuestionsGameService } from '../services/logicalQuestionsGame.service';

@Controller('games')
export class GamesController extends BaseController {
  constructor(
    private logicalQuestionsGameService: LogicalQuestionsGameService,
    private gameService: GamesService,
  ) {
    super();
  }

  @Post(':id/start-lqg')
  async startGameLQG(
    @Param('id') gameId: number,
    @Body('assessmentId') assessmentId: number,
    @Body('candidateId') candidateId: number,
    @Res() res: Response,
  ): Promise<any> {
    const gameStarted =
      await this.logicalQuestionsGameService.playLogicalQuestionsGame(
        gameId,
        assessmentId,
        candidateId,
      );
    return this.successResponse(
      {
        data: gameStarted,
      },
      res,
    );
  }

  @Post(':id/start-mg')
  async startGameMG(
    @Param('id') gameId: number,
    @Body('assessmentId') assessmentId: number,
    @Body('candidateId') candidateId: number,
    @Res() res: Response,
  ): Promise<any> {
    const gameStarted =
      await this.logicalQuestionsGameService.playLogicalQuestionsGame(
        gameId,
        assessmentId,
        candidateId,
      );
    return this.successResponse(
      {
        data: gameStarted,
      },
      res,
    );
  }

  @Post(':id/end')
  async endGame(
    @Param('id') gameId: number,
    @Body('assessmentId') assessmentId: number,
    @Body('candidateId') candidateId: number,
    @Res() res: Response,
  ): Promise<any> {
    const gameEnded = await this.gameService.endGame(
      gameId,
      assessmentId,
      candidateId,
    );
    return this.successResponse(
      {
        data: gameEnded,
      },
      res,
    );
  }

  @Post(':id/submit-answer-lqg')
  async submitGameAnswer(
    @Body('assessmentId') assessmentId: number,
    @Body('candidateId') candidateId: number,
    @Body('questionOrder') questionOrder: number,
    @Body('answer') answer: boolean,
    @Body('startTime') startTime: Date,
    @Param('id') gameId: number,
    @Res() res: Response,
  ): Promise<any> {
    const gameAnswer = await this.logicalQuestionsGameService.submitGameAnswer(
      assessmentId,
      candidateId,
      gameId,
      questionOrder,
      answer,
      startTime,
    );
    return this.successResponse(
      {
        data: gameAnswer,
        message: 'Answer submitted successfully',
      },
      res,
    );
  }

  @Post(':id/submit-answer-mg')
  async submitMemoryGameAnswer(
    @Param('id') gameId: number,
    @Body('assessmentId') assessmentId: number,
    @Body('candidateId') candidateId: number,
    @Body('levelOrder') levelOrder: number,
    @Body('answer') answer: Array<string>,
    @Body('startTime') startTime: Date,
    @Res() res: Response,
  ): Promise<any> {
    const gameAnswer = await this.gameService.submitMemoryGameAnswer(
      gameId,
      levelOrder,
      assessmentId,
      candidateId,
      answer,
      startTime,
    );
    return this.successResponse(
      {
        data: gameAnswer,
        message: 'Answer submitted successfully',
      },
      res,
    );
  }

  @Post(':id/skip-question')
  async skipQuestion(
    @Body('assessmentId') assessmentId: number,
    @Body('candidateId') candidateId: number,
    @Param('id') gameId: number,
    @Body('questionOrder') questionOrder: number,
    @Body('startTime') startTime: Date,
  ): Promise<GameAnswer> {
    return this.logicalQuestionsGameService.skipGameQuestion(
      assessmentId,
      candidateId,
      gameId,
      questionOrder,
      startTime,
    );
  }
}
