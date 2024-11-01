import { Processor, WorkerHost } from '@nestjs/bullmq';
import axios from 'axios';
import { Job } from 'bullmq';

@Processor('logical_question_game')
export class BullmqProcessor extends WorkerHost {
  async process(
    job: Job<{ candidateId: number; assessmentId: number }>,
  ): Promise<any> {
    if (job.name === 'endGame') {
      const { candidateId, assessmentId } = job.data;

      try {
        await axios.post('http://localhost:3000/games/1/end', {
          candidateId,
          assessmentId,
        });
        console.log(`Game ended hehe`);
      } catch (err) {
        console.error('Error ending game:', err.message);
      }
    }
  }
}
