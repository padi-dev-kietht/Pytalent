import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MemoryGameRepository } from '../repositories/memoryGame.repository';
import { MemoryGame } from '../entities/memory_game.entity';
import { MemoryGameService } from '../services/memoryGame.service';
import { GameAnswerModule } from './gameAnswer.module';
import { GamesModule } from './game.module';
import { UsersModule } from './users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([MemoryGame]),
    GameAnswerModule,
    forwardRef(() => GamesModule),
    forwardRef(() => UsersModule),
  ],
  providers: [MemoryGameRepository, MemoryGameService],
  exports: [MemoryGameRepository, MemoryGameService],
})
export class MemoryGameModule {}
