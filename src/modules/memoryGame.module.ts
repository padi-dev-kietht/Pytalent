import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MemoryGameRepository } from '../repositories/memoryGame.repository';
import { MemoryGame } from '../entities/memory_game.entity';

@Module({
  imports: [TypeOrmModule.forFeature([MemoryGame])],
  providers: [MemoryGameRepository],
  exports: [MemoryGameRepository],
})
export class MemoryGameModule {}
