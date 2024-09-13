import { Injectable, NotFoundException } from '@nestjs/common';
import { GamesService } from './game.service';
import { MemoryGame } from '../entities/memory_game.entity';
import { MemoryGameRepository } from '../repositories/memoryGame.repository';
import { GameAnswerDto } from '../dtos/gameAnswerResponse.dto';
import { GameAnswerRepository } from '../repositories/gameAnswer.repository';
import { UsersService } from './users.service';

@Injectable()
export class MemoryGameService {
  constructor(
    private readonly gameAnswerRepository: GameAnswerRepository,
    private readonly memoryGameRepository: MemoryGameRepository,
    private gameService: GamesService,
    private userService: UsersService,
  ) {}

  async getMemoryGame(levelOrder: number): Promise<MemoryGame> {
    const memoryGame = await this.memoryGameRepository.findOne({
      where: { order: levelOrder },
    });

    if (!memoryGame) {
      throw new NotFoundException('Memory game not found');
    }
    return memoryGame;
  }

  generatePatterns(count: number): string[] {
    const directions = ['left', 'right'];
    const patterns: string[] = [];

    for (let i = 0; i < count; i++) {
      let nextDirection;
      do {
        nextDirection =
          directions[Math.floor(Math.random() * directions.length)];
      } while (
        i >= 3 &&
        nextDirection === patterns[i - 1] &&
        nextDirection === patterns[i - 2]
      );

      patterns.push(nextDirection);
    }

    return patterns;
  }

  async getMemoryGameDetails(
    level: number,
    assessmentId: number,
  ): Promise<MemoryGame> {
    const number_of_patterns = level;
    const display_time = level * 30;
    const input_time = level <= 2 ? 30 : level * 30;
    const patterns = this.generatePatterns(number_of_patterns);

    return this.memoryGameRepository.save({
      level,
      order: level,
      number_of_patterns,
      display_time,
      input_time,
      assessment_id: assessmentId,
      patterns: patterns.join(','),
    });
  }

  async validateMemoryGameInput(
    levelOrder: number,
    userInput: string[],
  ): Promise<boolean> {
    const memoryGame = await this.getMemoryGame(levelOrder);
    const correctPatterns = memoryGame.patterns.split(',');
    return userInput.every((input, index) => input === correctPatterns[index]);
  }

  async submitMemoryGameAnswer(
    gameId: number,
    levelOrder: number,
    assessmentId: number,
    candidateId: number,
    userInput: string[],
    startTime: Date,
  ): Promise<any> {
    const isValid = await this.validateMemoryGameInput(levelOrder, userInput);
    const memoryGame = await this.getMemoryGame(levelOrder);
    await this.userService.validateCandidate(candidateId, assessmentId);

    const endTime = new Date();
    const timeTaken = (endTime.getTime() - startTime.getTime()) / 1000;
    const score = isValid ? 1 : 0;

    const gameAnswer = this.gameAnswerRepository.create({
      game_id: gameId,
      assessment_id: assessmentId,
      candidate_id: candidateId,
      answer: userInput.join(','),
      score,
      total_time: memoryGame.display_time,
      time_taken: timeTaken,
      is_correct: isValid,
    });

    if (
      !gameAnswer.is_correct ||
      gameAnswer.time_taken > gameAnswer.total_time
    ) {
      const savedGameAnswer = await this.gameAnswerRepository.save(gameAnswer);
      const gameAnswers: GameAnswerDto = {
        answer: savedGameAnswer.answer,
        totalTime: savedGameAnswer.total_time,
        time_taken: savedGameAnswer.time_taken,
        isCorrect: savedGameAnswer.is_correct,
      };
      return { gameAnswers, message: `Game Over!` };
    } else {
      const nextQuestion = await this.getMemoryGameDetails(
        levelOrder + 1,
        assessmentId,
      );

      const savedGameAnswer = await this.gameAnswerRepository.save(gameAnswer);
      const gameAnswers: GameAnswerDto = {
        answer: savedGameAnswer.answer,
        totalTime: savedGameAnswer.total_time,
        time_taken: savedGameAnswer.time_taken,
        isCorrect: savedGameAnswer.is_correct,
        nextQuestion: nextQuestion,
      };
      return gameAnswers;
    }
  }

  async playMemoryGame(
    gameId: number,
    assessmentId: number,
    candidateId: number,
    level: number,
  ) {
    await this.gameService.startGame(gameId, assessmentId, candidateId);
    await this.gameService.validateMemoryGame(gameId);
    if (!level) {
      throw new NotFoundException('Level is required for memory game');
    }
    //Delete previous memory game
    await this.gameService.deletePreviousMemory(assessmentId);

    const firstMemory = await this.getMemoryGameDetails(level, assessmentId);
    const gameStartedTimer = new Date();
    return { candidateId, assessmentId, gameStartedTimer, firstMemory };
  }
}
