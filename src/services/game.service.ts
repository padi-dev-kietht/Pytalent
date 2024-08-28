import { Injectable, NotFoundException } from '@nestjs/common';
import { LogicalQuestionsRepository } from '../repositories/logicalQuestion.repository';
import { GamesRepository } from '../repositories/game.repository';
import { GameAnswerRepository } from '../repositories/gameAnswer.repository';
import { LogicalQuestions } from '../entities/logical_questions.entity';
import { MemoryGameRepository } from '../repositories/memoryGame.repository';
import { MemoryGame } from '../entities/memory_game.entity';
import { Games } from '../entities/games.entity';
import { GameQuestionsRepository } from '../repositories/gameQuestion.repository';
import { AssessmentsRepository } from '../repositories/assessment.repository';
import { GameResultRepository } from '../repositories/gameResult.repository';
import { AssessmentStatusEnum } from '../common/enum/assessment-status.enum';

@Injectable()
export class GamesService {
  constructor(
    private gamesRepository: GamesRepository,
    private gameAnswerRepository: GameAnswerRepository,
    private logicalQuestionsRepository: LogicalQuestionsRepository,
    private memoryGameRepository: MemoryGameRepository,
    private gameQuestionsRepository: GameQuestionsRepository,
    private assessmentsRepository: AssessmentsRepository,
    private gameResultRepository: GameResultRepository,
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

  // Game start
  async startGame(
    gameId: number,
    assessmentId: number,
    level?: number,
  ): Promise<any> {
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

    assessment.status = AssessmentStatusEnum.IN_PROGRESS;
    await this.assessmentsRepository.save(assessment);

    if (game.game_type === 'logical') {
      // Delete previous game questions
      await this.gameQuestionsRepository.delete({
        game_id: gameId,
        assessment_id: assessmentId,
      });

      const randomQuestionsList = await this.getRandomQuestions();
      const gameQuestions = randomQuestionsList.map((question, index) => ({
        question_id: question.id,
        game_id: gameId,
        assessment_id: assessmentId,
        order: index + 1,
      }));
      await this.gameQuestionsRepository.save(gameQuestions);

      const gameStartedTimer = new Date();
      return { assessmentId, gameStartedTimer };
    }
    if (game.game_type === 'memory') {
      const data = await this.getMemoryGameDetails(level);
      const gameStartedTimer = new Date();
      return { assessmentId, gameStartedTimer, data };
    }
  }

  //Game end
  async endGame(gameId: number, assessmentId: number): Promise<any> {
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

    if (game.game_type === 'logical' || game.game_type === 'memory') {
      const gameAnswers = await this.gameAnswerRepository.find({
        where: {
          game_id: gameId,
          assessment_id: assessmentId,
        },
      });

      const totalScore = gameAnswers.reduce(
        (acc, answer) => acc + answer.score,
        0,
      );

      const gameResult = this.gameResultRepository.create({
        candidate_id: assessment.candidate_id,
        game_id: gameId,
        assessment_id: assessmentId,
        score: totalScore,
      });

      await this.gameResultRepository.save(gameResult);
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
    assessmentId: number,
    gameId: number,
    questionOrder: number,
    answer: boolean,
    startTime: Date,
  ): Promise<any> {
    const assessment = await this.assessmentsRepository.findOne({
      where: { id: assessmentId },
    });
    if (!assessment) {
      throw new NotFoundException('Assessment not found');
    }

    const question = await this.gameQuestionsRepository.findOne({
      where: { game: { id: gameId }, order: questionOrder },
      relations: ['question'],
    });
    if (!question) {
      throw new NotFoundException('Question not found');
    }

    const game = await this.gamesRepository.findOne({
      where: { id: gameId },
      relations: ['assessments'],
    });
    if (!game) {
      throw new NotFoundException('Game not found');
    }

    const totalTime = 90; //fixes the total time to 90 seconds
    const isCorrect = question.question.is_conclusion_correct === answer;

    const endTime = new Date();
    const timeTaken = (endTime.getTime() - startTime.getTime()) / 1000;

    const gameAnswer = this.gameAnswerRepository.create({
      game_id: gameId,
      question_id: question.question.id,
      assessment_id: assessmentId,
      answer: answer.toString(),
      score: isCorrect ? 1 : 0,
      total_time: totalTime,
      time_taken: timeTaken,
      is_correct: isCorrect,
    });

    if (timeTaken > totalTime) {
      return 'Timed out';
    }

    return this.gameAnswerRepository.save(gameAnswer);
  }

  async skipGameQuestion(
    assessmentId: number,
    gameId: number,
    questionOrder: number,
    startTime: Date,
  ): Promise<any> {
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

    const totalTime = 90; //fixes the total time to 90 seconds

    const endTime = new Date();
    const timeTaken = (endTime.getTime() - startTime.getTime()) / 1000;

    const gameAnswer = this.gameAnswerRepository.create({
      game_id: gameId,
      question_id: question.question.id,
      assessment_id: assessmentId,
      answer: 'skipped',
      score: 0,
      total_time: totalTime,
      time_taken: timeTaken,
      is_correct: false,
    });

    if (timeTaken > totalTime) {
      return 'Timed out';
    }

    return this.gameAnswerRepository.save(gameAnswer);
  }

  //Memory Game
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
      patterns: patterns.join(','),
    });
  }

  async validateMemoryGameInput(
    gameId: number,
    userInput: string[],
  ): Promise<boolean> {
    const memoryGame = await this.memoryGameRepository.findOne({
      where: { id: gameId },
    });

    if (!memoryGame) {
      throw new NotFoundException('Memory game not found');
    }
    const correctPatterns = memoryGame.patterns.split(',');

    return userInput.every((input, index) => input === correctPatterns[index]);
  }

  async submitMemoryGameAnswer(
    gameId: number,
    levelOrder: number,
    assessmentId: number,
    userInput: string[],
    startTime: Date,
  ): Promise<any> {
    const isValid = await this.validateMemoryGameInput(levelOrder, userInput);

    const memoryGameDetail = await this.memoryGameRepository.findOne({
      where: { id: levelOrder },
    });

    const endTime = new Date();
    const timeTaken = (endTime.getTime() - startTime.getTime()) / 1000;

    const score = isValid ? 1 : 0;
    const gameAnswer = this.gameAnswerRepository.create({
      game_id: gameId,
      assessment_id: assessmentId,
      answer: userInput.join(','),
      score,
      total_time: memoryGameDetail.display_time,
      time_taken: timeTaken,
      is_correct: isValid,
    });

    if (gameAnswer.time_taken > gameAnswer.total_time) {
      return 'Timed out';
    }

    await this.gameAnswerRepository.save(gameAnswer);
    return gameAnswer;
  }
}
