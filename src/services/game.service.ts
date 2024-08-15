import { Injectable, NotFoundException } from '@nestjs/common';
import { LogicalQuestionsRepository } from '../repositories/logicalQuestion.repository';
import { GamesRepository } from '../repositories/game.repository';
import { GameAnswerRepository } from '../repositories/gameAnswer.repository';
import { Games } from '../entities/games.entity';
import { GameAnswer } from '../entities/game_answer.entity';

@Injectable()
export class GamesService {
  constructor(
    private gamesRepository: GamesRepository,
    private gameAnswerRepository: GameAnswerRepository,
    private logicalQuestionsRepository: LogicalQuestionsRepository,
  ) {}

  async getGameById(id: number): Promise<Games> {
    return this.gamesRepository.findOne({
      where: { id },
      relations: ['gameAnswers'],
    });
  }

  async submitGameAnswer(
    gameId: number,
    questionId: number,
    answer: boolean,
  ): Promise<GameAnswer> {
    const question = await this.logicalQuestionsRepository.findOne({
      where: { id: questionId },
    });
    if (!question) {
      throw new NotFoundException('Question not found');
    }

    const game = await this.gamesRepository.findOne({ where: { id: gameId } });
    if (!game) {
      throw new NotFoundException('Game not found');
    }

    const isCorrect = question.is_conclusion_correct === answer;
    const gameAnswer = this.gameAnswerRepository.create({
      game_id: gameId,
      question_id: questionId,
      answer: answer.toString(),
      score: isCorrect ? 1 : 0,
      is_correct: isCorrect,
    });

    return this.gameAnswerRepository.save(gameAnswer);
  }
}
