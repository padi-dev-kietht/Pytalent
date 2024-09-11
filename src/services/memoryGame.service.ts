import { Injectable, NotFoundException } from '@nestjs/common';
import { GamesService } from './game.service';

@Injectable()
export class MemoryGameService {
  constructor(private gameService: GamesService) {}
  async playMemoryGame(
    gameId: number,
    assessmentId: number,
    candidateId: number,
    level: number,
  ) {
    await this.gameService.startGame(gameId, assessmentId, candidateId);

    const game = await this.gameService.getGameById(gameId);
    if (game.game_type === 'memory') {
      if (!level) {
        throw new NotFoundException('Level is required for memory game');
      }
      //Delete previous memory game
      await this.gameService.deletePreviousMemory(assessmentId);

      const data = await this.gameService.getMemoryGameDetails(
        level,
        assessmentId,
      );
      const gameStartedTimer = new Date();
      return { candidateId, assessmentId, gameStartedTimer, data };
    }
    return { message: `Not this game` };
  }
}
