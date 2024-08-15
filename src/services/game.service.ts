import { Injectable, NotFoundException } from '@nestjs/common';
import { LogicalQuestionsRepository } from '../repositories/logicalQuestion.repository';
import { GamesRepository } from '../repositories/game.repository';
import { GameAnswerRepository } from '../repositories/gameAnswer.repository';
import { GameAnswer } from '../entities/game_answer.entity';
import { LogicalQuestions } from '../entities/logical_questions.entity';
import { MemoryGameRepository } from '../repositories/memoryGame.repository';
import { MemoryGame } from '../entities/memory_game.entity';

@Injectable()
export class GamesService {
  constructor(
    private gamesRepository: GamesRepository,
    private gameAnswerRepository: GameAnswerRepository,
    private logicalQuestionsRepository: LogicalQuestionsRepository,
    private memoryGameRepository: MemoryGameRepository,
  ) {}

  // Logical Questions Game
  async getRandomQuestions(): Promise<LogicalQuestions[]> {
    const questions = await this.logicalQuestionsRepository.find();
    const yesQuestions = questions.filter((q) => q.is_conclusion_correct);
    const noQuestions = questions.filter((q) => !q.is_conclusion_correct);

    const selectedQuestions = [];
    for (let i = 0; i < 10; i++) {
      selectedQuestions.push(
        yesQuestions.splice(
          Math.floor(Math.random() * yesQuestions.length),
          1,
        )[0],
      );
      selectedQuestions.push(
        noQuestions.splice(
          Math.floor(Math.random() * noQuestions.length),
          1,
        )[0],
      );
    }

    const sortedQuestions = [];
    let trueCount = 0;
    let falseCount = 0;

    while (selectedQuestions.length > 0) {
      const randomIndex = Math.floor(Math.random() * selectedQuestions.length);
      const question = selectedQuestions.splice(randomIndex, 1)[0];
      if (question.is_conclusion_correct) {
        if (trueCount <= 3) {
          sortedQuestions.push(question);
          trueCount++;
          if (trueCount === 3) {
            falseCount = 0;
          }
        }
      } else {
        if (falseCount <= 3) {
          sortedQuestions.push(question);
          falseCount++;
          if (falseCount === 3) {
            trueCount = 0;
          }
        }
      }
    }

    return sortedQuestions;
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

  //Memory Game
  generatePatterns(count: number): string[] {
    const directions = ['left', 'right'];
    return Array.from(
      { length: count },
      () => directions[Math.floor(Math.random() * directions.length)],
    );
  }

  async getMemoryGameDetails(level: number): Promise<MemoryGame> {
    const number_of_patterns = level;
    const display_time = level;
    const input_time = level <= 2 ? 3 : level;
    const patterns = this.generatePatterns(number_of_patterns);

    return this.memoryGameRepository.save({
      level,
      number_of_patterns,
      display_time,
      input_time,
      patterns,
    });
  }
}
