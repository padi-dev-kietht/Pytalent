import { InjectQueue } from '@nestjs/bullmq';
import { Injectable } from '@nestjs/common';
import { Queue } from 'bullmq';

@Injectable()
export class BullmqService {
  constructor(
    @InjectQueue('logical_question_game')
    private readonly gameQueue: Queue,
  ) {}

  async addGameTimeoutJob(candidateId: number, assessmentId: number) {
    await this.gameQueue.add(
      'endGame',
      { candidateId, assessmentId },
      { delay: 90000 },
    );
  }
}
