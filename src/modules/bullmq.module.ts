import { BullModule } from '@nestjs/bullmq';
import { Module } from '@nestjs/common';
import { BullmqService } from '../services/bullmq.service';

@Module({
  imports: [
    BullModule.forRoot({
      connection: {
        host: 'localhost',
        port: 6379,
      },
    }),
    BullModule.registerQueue({
      name: 'logical_question_game',
    }),
  ],
  providers: [BullmqService],
  exports: [BullmqService],
})
export class BullMqModule {}
