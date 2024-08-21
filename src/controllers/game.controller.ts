import { Body, Controller, Get, Param, Post } from '@nestjs/common';

import { BaseController } from './base.controller';
import { GamesService } from '../services/game.service';
import { GameAnswer } from '../entities/game_answer.entity';
import { GamesRepository } from '../repositories/game.repository';

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
  async startGame(@Param('id') gameId: number): Promise<any> {
    return this.gameService.startGame(gameId);
  }

  @Post(':id/submit-answer')
  async submitGameAnswer(
    @Param('id') gameId: number,
    @Body('questionOrder') questionOrder: number,
    @Body('answer') answer: boolean,
  ): Promise<GameAnswer> {
    return this.gameService.submitGameAnswer(gameId, questionOrder, answer);
  }
}
