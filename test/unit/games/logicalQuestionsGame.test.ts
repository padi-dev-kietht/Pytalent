import { NotFoundException } from '@nestjs/common';
import { LogicalQuestionsGameService } from '../../../src/services/logicalQuestionsGame.service';
import {
  getGameQuestionTestData,
  getLogicalQuestionsTestData,
  getRandomQuestionsTestData,
  playLogicalQuestionsGameData,
} from '../../../src/factories/test/data';

describe('LogicalQuestionsGameService', () => {
  describe('#getLogicalQuestions()', () => {
    const table = getLogicalQuestionsTestData;

    test.each(table)(``, async ({ allResults, expected }) => {
      const mockLogicalQuestionsRepository = {
        find: jest.fn().mockResolvedValue(allResults),
      };

      const service = new LogicalQuestionsGameService(
        {} as any,
        mockLogicalQuestionsRepository as any,
        {} as any,
        {} as any,
        {} as any,
        {} as any,
      );

      if (!expected) {
        await expect(service.getLogicalQuestions()).rejects.toThrow(
          new NotFoundException('Questions not found.'),
        );
      }

      if (expected) {
        const result = await service.getLogicalQuestions();
        expect(result).toEqual(expected);
      }
    });
  });
  describe('#getGameQuestion()', () => {
    const table = getGameQuestionTestData;

    test.each(table)(
      `questionOrder: $questionOrder`,
      async ({ questionOrder, allResults, expected }) => {
        // Mock the gameQuestionsRepository with findOne
        const mockGameQuestionsRepository = {
          findOne: jest.fn().mockResolvedValue(allResults),
        };

        // Create the service with the mock repository
        const service = new LogicalQuestionsGameService(
          mockGameQuestionsRepository as any,
          {} as any,
          {} as any,
          {} as any,
          {} as any,
          {} as any,
        );

        if (!expected) {
          // Test the NotFoundException scenario
          await expect(
            service.getGameQuestionOrThrow(questionOrder),
          ).rejects.toThrow(new NotFoundException('Question not found'));
        } else {
          // Test the success scenario
          const result = await service.getGameQuestionOrThrow(questionOrder);
          expect(result).toEqual(expected);
        }
      },
    );
  });
  describe('#getRandomQuestions()', () => {
    const table = getRandomQuestionsTestData;

    test.each(table)(``, async ({ allResults, expected }) => {
      const mockLogicalQuestionsRepository = {
        find: jest.fn().mockResolvedValue(allResults),
      };

      const service = new LogicalQuestionsGameService(
        {} as any,
        mockLogicalQuestionsRepository as any,
        {} as any,
        {} as any,
        {} as any,
        {} as any,
      );

      const result = await service.getRandomQuestions();

      expect(result.length).toBe(expected.total);

      const yesQuestions = result.filter((q) => q.is_conclusion_correct).length;
      const noQuestions = result.filter((q) => !q.is_conclusion_correct).length;

      expect(yesQuestions).toBe(expected.true);
      expect(noQuestions).toBe(expected.false);
    });
  });
  describe('#playLogicalQuestionsGame()', () => {
    const table = playLogicalQuestionsGameData;

    test.each(table)(
      `$description`,
      async ({
        gameId,
        assessmentId,
        candidateId,
        questionsList,
        expected,
        startGameError,
        expectedError,
        saveError,
      }) => {
        const mockGameServices = {
          startGame: jest
            .fn()
            .mockResolvedValue(undefined)
            .mockRejectedValueOnce(startGameError),
          validateLogicalQuestionGame: jest.fn().mockResolvedValue(undefined),
          deletePreviousQuestion: jest.fn().mockResolvedValue(undefined),
          getGameQuestionByAssessmentId: jest
            .fn()
            .mockResolvedValue(questionsList),
        };

        const mockGameQuestionsRepository = {
          save: jest
            .fn()
            .mockResolvedValue(undefined)
            .mockRejectedValueOnce(saveError),
        };

        const service = new LogicalQuestionsGameService(
          mockGameQuestionsRepository as any,
          {} as any,
          {} as any,
          mockGameServices as any,
          {} as any,
          {} as any,
        );

        if (expectedError) {
          await expect(
            service.playLogicalQuestionsGame(gameId, assessmentId, candidateId),
          ).rejects.toThrow(expectedError);
        } else {
          const result = await service.playLogicalQuestionsGame(
            gameId,
            assessmentId,
            candidateId,
          );
          expect(result).toEqual(expected);
        }
      },
    );
  });
});
