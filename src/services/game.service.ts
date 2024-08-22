import { Injectable, NotFoundException } from '@nestjs/common';
import { LogicalQuestionsRepository } from '../repositories/logicalQuestion.repository';
import { GamesRepository } from '../repositories/game.repository';
import { GameAnswerRepository } from '../repositories/gameAnswer.repository';
import { GameAnswer } from '../entities/game_answer.entity';
import { LogicalQuestions } from '../entities/logical_questions.entity';
import { MemoryGameRepository } from '../repositories/memoryGame.repository';
import { MemoryGame } from '../entities/memory_game.entity';
import { Games } from '../entities/games.entity';
import { GameQuestionsRepository } from '../repositories/gameQuestion.repository';
import { AssessmentsRepository } from '../repositories/assessment.repository';
import { getConnection } from 'typeorm';

@Injectable()
export class GamesService {
  constructor(
    private gamesRepository: GamesRepository,
    private gameAnswerRepository: GameAnswerRepository,
    private logicalQuestionsRepository: LogicalQuestionsRepository,
    private memoryGameRepository: MemoryGameRepository,
    private gameQuestionsRepository: GameQuestionsRepository,
    private assessmentsRepository: AssessmentsRepository,
  ) {}

  // Global
  async getGames(): Promise<Games[]> {
    return this.gamesRepository.find();
  }

  async getGameById(id: number): Promise<Games> {
    const game = await this.gamesRepository.findOne({ where: { id } });
    if (!game) {
      throw new NotFoundException('Game not found');
    }
    return game;
  }

  async startGame(gameId: number, assessmentId: number): Promise<any> {
    const game = await this.gamesRepository.findOne({
      where: { id: gameId },
    });

    if (!game) {
      throw new NotFoundException('Game not found');
    }

    const assessment = await this.assessmentsRepository.findOne({
      where: { id: assessmentId },
    });
    if (!assessment) {
      throw new NotFoundException('Assessment not found');
    }

    const assessmentGame = await this.assessmentsRepository.query(
      `SELECT game_id FROM assessments_games WHERE game_id = ${gameId} AND assessment_id = ${assessmentId}`,
    );

    if (assessmentGame.length === 0) {
      throw new NotFoundException('Game is not assigned in that assessment');
    }

    if (game.game_type === 'logical') {
      // Delete previous game questions
      await this.gameQuestionsRepository.delete({ game_id: gameId });

      const randomQuestionsList = await this.getRandomQuestions();
      const gameQuestions = randomQuestionsList.map((question, index) => ({
        question_id: question.id,
        game_id: gameId,
        order: index + 1,
      }));
      await this.gameQuestionsRepository.save(gameQuestions);
      return 'GEEMU SUTAATO!';
    }
    if (game.game_type === 'memory') {
      const d = await this.getMemoryGameDetails(25);
      return d;
    }
  }

  // Logical Questions Game
  async getLogicalQuestions(): Promise<LogicalQuestions[]> {
    return this.logicalQuestionsRepository.find();
  }

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
        if (trueCount < 3) {
          sortedQuestions.push(question);
          trueCount++;
          falseCount = 0;
        } else {
          selectedQuestions.push(question);
        }
      } else {
        if (falseCount < 3) {
          sortedQuestions.push(question);
          falseCount++;
          trueCount = 0;
        } else {
          selectedQuestions.push(question);
        }
      }
    }

    return sortedQuestions;
  }

  async submitGameAnswer(
    gameId: number,
    questionOrder: number,
    answer: boolean,
  ): Promise<GameAnswer> {
    const question = await this.gameQuestionsRepository.findOne({
      where: { game: { id: gameId }, order: questionOrder },
      relations: ['question'],
    });
    if (!question) {
      throw new NotFoundException('Question not found');
    }

    const game = await this.gamesRepository.findOne({ where: { id: gameId } });
    if (!game) {
      throw new NotFoundException('Game not found');
    }

    const isCorrect = question.question.is_conclusion_correct === answer;
    const gameAnswer = this.gameAnswerRepository.create({
      game_id: gameId,
      question_id: question.question.id,
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
