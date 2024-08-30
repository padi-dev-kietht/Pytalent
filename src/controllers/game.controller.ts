import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common';

import { BaseController } from './base.controller';
import { GamesService } from '../services/game.service';
import { GameAnswer } from '../entities/game_answer.entity';
import { Response } from 'express';

@Controller('games')
export class GamesController extends BaseController {
  constructor(private gameService: GamesService) {
    super();
  }

  @Get()
  async getGames(): Promise<any> {
    return this.gameService.getGames();
  }

  @Get(':id')
  async getGameById(@Param('id') gameId: number): Promise<any> {
    return this.gameService.getGameById(gameId);
  }

  @Post(':id/start')
  async startGame(
    @Param('id') gameId: number,
    @Body('assessmentId') assessmentId: number,
    @Body('candidateId') candidateId: number,
    @Res() res: Response,
    @Body('level') level?: number,
  ): Promise<any> {
    const gameStarted = await this.gameService.startGame(
      gameId,
      assessmentId,
      candidateId,
      level,
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
    const gameAnswer = await this.gameService.submitGameAnswer(
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
    return this.gameService.skipGameQuestion(
      assessmentId,
      candidateId,
      gameId,
      questionOrder,
      startTime,
    );
  }
}
