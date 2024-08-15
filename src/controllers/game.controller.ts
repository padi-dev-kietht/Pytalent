import { Body, Controller, Get, Param, Post } from '@nestjs/common';

import { BaseController } from './base.controller';
import { GamesService } from '../services/game.service';
import { GameAnswer } from '../entities/game_answer.entity';

@Controller('games')
export class GamesController extends BaseController {
  constructor(private gameService: GamesService) {
    super();
  }

  // @Get(':id')
  // async getGameById(id: number) {
  //   return this.gameService.getGameById(id);
  // }

  @Post(':id/start')
  async startLogicalQuestionsGame(@Param('id') gameId: number): Promise<any> {
    const q = await this.gameService.getRandomQuestions();
    return q;
  }

  @Post(':id/submit-answer')
  async submitGameAnswer(
    @Param('id') gameId: number,
    @Body('questionId') questionId: number,
    @Body('answer') answer: boolean,
  ): Promise<GameAnswer> {
    return this.gameService.submitGameAnswer(gameId, questionId, answer);
  }
}
