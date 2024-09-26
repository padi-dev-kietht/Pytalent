import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
  RequestTimeoutException,
} from '@nestjs/common';
import { GamesService } from './game.service';
import { GameQuestionsRepository } from '../repositories/gameQuestion.repository';
import { LogicalQuestionsRepository } from '../repositories/logicalQuestion.repository';
import { LogicalQuestions } from '../entities/logical_questions.entity';
import { GameAnswerDto } from '../dtos/gameAnswerResponse.dto';
import { AssessmentService } from './assessment.service';
import { UsersService } from './users.service';
import { GameAnswerRepository } from '../repositories/gameAnswer.repository';

@Injectable()
export class LogicalQuestionsGameService {
  constructor(
    private gameQuestionsRepository: GameQuestionsRepository,
    private logicalQuestionsRepository: LogicalQuestionsRepository,
    private gameAnswerRepository: GameAnswerRepository,
    @Inject(forwardRef(() => GamesService))
    private gameService: GamesService,
    @Inject(forwardRef(() => AssessmentService))
    private assessmentService: AssessmentService,
    @Inject(forwardRef(() => UsersService))
    private userService: UsersService,
  ) {}

  async getLogicalQuestions(): Promise<LogicalQuestions[]> {
    const questions = await this.logicalQuestionsRepository.find({});
    if (questions.length === 0) {
      throw new NotFoundException('Questions not found.');
    }
    return questions;
  }

  async getGameQuestionOrThrow(questionOrder: number) {
    const question = await this.gameQuestionsRepository.findOne({
      where: { order: questionOrder },
      relations: ['question'],
    });
    if (!question) {
      throw new NotFoundException('Question not found');
    }
    return question;
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
      if (!question) {
        continue;
      }
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

  async playLogicalQuestionsGame(
    gameId: number,
    assessmentId: number,
    candidateId: number,
  ) {
    await this.gameService.startGame(gameId, assessmentId, candidateId);
    await this.gameService.validateLogicalQuestionsGame(gameId);
    await this.gameService.deletePreviousQuestions(assessmentId);

    const randomQuestionsList = await this.getRandomQuestions();
    const gameQuestions = randomQuestionsList.map((question, index) => ({
      question_id: question.id,
      game_id: gameId,
      assessment_id: assessmentId,
      order: index + 1,
      created_at: new Date(),
    }));
    await this.gameQuestionsRepository.save(gameQuestions);

    const gameStartedTimer = new Date();
    const questionsList = await this.gameService.getGameQuestionsByAssessmentId(
      assessmentId,
    );
    const firstQuestion = questionsList[0];
    return { candidateId, assessmentId, gameStartedTimer, firstQuestion };
  }

  async submitGameAnswer(
    assessmentId: number,
    candidateId: number,
    gameId: number,
    questionOrder: number,
    answer: boolean,
    startTime: Date,
  ): Promise<GameAnswerDto> {
    await this.assessmentService.validateAssessmentById(assessmentId);
    await this.gameService.validateGameById(gameId);
    await this.userService.validateCandidate(candidateId, assessmentId);

    const question = await this.getGameQuestionOrThrow(questionOrder);

    const totalTime = 90; //fixes the total time to 90 seconds
    const isCorrect = question.question.is_conclusion_correct === answer;
    const endTime = new Date();
    const timeTaken = (endTime.getTime() - startTime.getTime()) / 1000;

    const gameAnswer = this.gameAnswerRepository.create({
      game_id: gameId,
      question_id: question.question.id,
      assessment_id: assessmentId,
      candidate_id: candidateId,
      answer: answer.toString(),
      score: isCorrect ? 1 : 0,
      total_time: totalTime,
      time_taken: timeTaken,
      is_correct: isCorrect,
    });

    if (timeTaken > totalTime) {
      throw new RequestTimeoutException('Timed out');
    }

    const nextQuestion = await this.gameService.getNextQuestion(questionOrder);

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

  async skipGameQuestion(
    assessmentId: number,
    candidateId: number,
    gameId: number,
    questionOrder: number,
    startTime: Date,
  ): Promise<any> {
    await this.assessmentService.validateAssessmentById(assessmentId);
    await this.gameService.validateGameById(gameId);
    await this.userService.validateCandidate(candidateId, assessmentId);

    const question = await this.getGameQuestionOrThrow(questionOrder);

    const totalTime = 90; //fixes the total time to 90 seconds
    const endTime = new Date();
    const timeTaken = (endTime.getTime() - startTime.getTime()) / 1000;

    const gameAnswer = this.gameAnswerRepository.create({
      game_id: gameId,
      question_id: question.question.id,
      assessment_id: assessmentId,
      candidate_id: candidateId,
      answer: 'skipped',
      score: 0,
      total_time: totalTime,
      time_taken: timeTaken,
      is_correct: false,
    });

    if (timeTaken > totalTime) {
      throw new RequestTimeoutException('Timed out');
    }

    const nextQuestion = await this.gameService.getNextQuestion(questionOrder);

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
