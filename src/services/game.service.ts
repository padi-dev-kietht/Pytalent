import { Injectable, NotFoundException } from '@nestjs/common';
import { GamesRepository } from '../repositories/game.repository';
import { GameAnswerRepository } from '../repositories/gameAnswer.repository';
import { MemoryGameRepository } from '../repositories/memoryGame.repository';
import { MemoryGame } from '../entities/memory_game.entity';
import { Games } from '../entities/games.entity';
import { GameQuestionsRepository } from '../repositories/gameQuestion.repository';
import { AssessmentsRepository } from '../repositories/assessment.repository';
import { GameResultRepository } from '../repositories/gameResult.repository';
import { AssessmentStatusEnum } from '../common/enum/assessment-status.enum';
import { GameQuestions } from '../entities/game_questions.entity';
import { GameAnswerDto } from '../dtos/gameAnswerResponse.dto';
import { AssessmentService } from './assessment.service';
import { UsersService } from './users.service';
import { GameAnswer } from '../entities/game_answer.entity';

@Injectable()
export class GamesService {
  constructor(
    private gamesRepository: GamesRepository,
    private gameAnswerRepository: GameAnswerRepository,
    private memoryGameRepository: MemoryGameRepository,
    private gameQuestionsRepository: GameQuestionsRepository,
    private assessmentsRepository: AssessmentsRepository,
    private gameResultRepository: GameResultRepository,
    private assessmentService: AssessmentService,
    private userService: UsersService,
  ) {}

  //Game GET/DELETE
  async getGameById(gameId: number) {
    return this.gamesRepository.findOne({
      where: { id: gameId },
    });
  }

  async getGameAnswers(
    gameId: number,
    assessmentId: number,
  ): Promise<GameAnswer[]> {
    return this.gameAnswerRepository.find({
      where: {
        game_id: gameId,
        assessment_id: assessmentId,
      },
    });
  }

  async getGameQuestionsByAssessmentId(
    assessment_id: number,
  ): Promise<GameQuestions[]> {
    return this.gameQuestionsRepository.find({ where: { assessment_id } });
  }

  async getNextQuestion(questionOrder: number) {
    return this.gameQuestionsRepository.findOne({
      where: { order: questionOrder + 1 },
      select: ['id', 'order'],
      relations: ['question'],
    });
  }

  async deletePreviousQuestions(assessmentId: number) {
    await this.gameQuestionsRepository.delete({
      assessment_id: assessmentId,
    });
  }

  async deletePreviousMemory(assessmentId: number) {
    await this.memoryGameRepository.delete({ assessment_id: assessmentId });
  }

  // Game VALIDATION
  async validateAssessmentGames(gameId: number, assessmentId: number) {
    const assessmentGame = await this.assessmentsRepository.query(
      `SELECT game_id FROM assessments_games WHERE game_id = ${gameId} AND assessment_id = ${assessmentId}`,
    );
    if (assessmentGame.length === 0) {
      throw new NotFoundException('Game is not assigned in that assessment');
    }
  }

  async validateGameById(id: number) {
    const game = await this.gamesRepository.findOne({ where: { id } });
    if (!game) {
      throw new NotFoundException('Game not found');
    }
  }

  // Game start
  async startGame(
    gameId: number,
    assessmentId: number,
    candidateId: number,
  ): Promise<any> {
    await this.validateGameById(gameId);
    await this.assessmentService.validateAssessmentById(assessmentId);
    await this.userService.validateCandidate(candidateId, assessmentId);
    await this.validateAssessmentGames(gameId, assessmentId);

    const assessment = await this.assessmentService.getAssessmentById(
      assessmentId,
    );

    assessment.status = AssessmentStatusEnum.IN_PROGRESS;
    await this.assessmentsRepository.save(assessment);
  }

  //Game end
  async endGame(
    gameId: number,
    assessmentId: number,
    candidateId: number,
  ): Promise<any> {
    await this.validateGameById(gameId);
    await this.assessmentService.validateAssessmentById(assessmentId);
    await this.userService.validateCandidate(candidateId, assessmentId);
    await this.validateAssessmentGames(gameId, assessmentId);

    const gameAnswers = await this.getGameAnswers(gameId, assessmentId);

    const totalScore = gameAnswers.reduce(
      (acc, answer) => acc + answer.score,
      0,
    );

    const gameResult = this.gameResultRepository.create({
      candidate_id: candidateId,
      game_id: gameId,
      assessment_id: assessmentId,
      score: totalScore,
    });

    await this.gameResultRepository.save(gameResult);
    return gameResult;
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
    const memoryGame = await this.memoryGameRepository.findOne({
      where: { order: levelOrder },
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
    candidateId: number,
    userInput: string[],
    startTime: Date,
  ): Promise<any> {
    const isValid = await this.validateMemoryGameInput(levelOrder, userInput);

    const memoryGameDetail = await this.memoryGameRepository.findOne({
      where: { order: levelOrder },
    });

    const candidate = await this.assessmentsRepository.query(
      `SELECT candidate_id FROM assessments_candidates WHERE candidate_id = $1 AND assessment_id = $2`,
      [candidateId, assessmentId],
    );
    if (candidate.length === 0) {
      throw new NotFoundException(
        'Candidate is not assigned in that assessment',
      );
    }

    const endTime = new Date();
    const timeTaken = (endTime.getTime() - startTime.getTime()) / 1000;

    const score = isValid ? 1 : 0;
    const gameAnswer = this.gameAnswerRepository.create({
      game_id: gameId,
      assessment_id: assessmentId,
      candidate_id: candidateId,
      answer: userInput.join(','),
      score,
      total_time: memoryGameDetail.display_time,
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
}
