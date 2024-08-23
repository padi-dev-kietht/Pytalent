import { Body, Controller, Get, Param, Post, Res } from '@nestjs/common';

import { BaseController } from './base.controller';
import { GamesService } from '../services/game.service';
import { GameAnswer } from '../entities/game_answer.entity';
import { GamesRepository } from '../repositories/game.repository';
import { Response } from 'express';

@Controller('games')
export class GamesController extends BaseController {
  constructor(
    private gameRepository: GamesRepository,
    private gameService: GamesService,
  ) {
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
    @Res() res: Response,
  ): Promise<any> {
    const gameStarted = await this.gameService.startGame(gameId, assessmentId);
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
    @Res() res: Response,
  ): Promise<any> {
    const gameEnded = await this.gameService.endGame(gameId, assessmentId);
    return this.successResponse(
      {
        data: gameEnded,
      },
      res,
    );
  }

  @Post(':id/submit-answer')
  async submitGameAnswer(
    @Body('assessmentId') assessmentId: number,
    @Body('questionOrder') questionOrder: number,
    @Body('answer') answer: boolean,
    @Body('startTime') startTime: Date,
    @Param('id') gameId: number,
  ): Promise<GameAnswer> {
    return this.gameService.submitGameAnswer(
      assessmentId,
      gameId,
      questionOrder,
      answer,
      startTime,
    );
  }

  @Post(':id/skip-question')
  async skipQuestion(
    @Param('id') gameId: number,
    @Body('questionOrder') questionOrder: number,
    @Body('startTime') startTime: Date,
  ): Promise<GameAnswer> {
    return this.gameService.skipGameQuestion(gameId, questionOrder, startTime);
  }
}
