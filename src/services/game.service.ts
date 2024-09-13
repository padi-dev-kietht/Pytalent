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

  async validateLogicalQuestionsGame(gameId: number) {
    const lQGame = await this.getGameById(gameId);
    if (lQGame.game_type === 'logical') return;
    else throw new Error('Wrong Game');
  }

  async validateMemoryGame(gameId: number) {
    const lQGame = await this.getGameById(gameId);
    if (lQGame.game_type === 'memory') return;
    else throw new Error('Wrong Game');
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
}
