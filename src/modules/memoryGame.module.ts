import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MemoryGameEntity } from '../entities';
import { MemoryGameRepository } from '../repositories/memoryGame.repository';

@Module({
  imports: [TypeOrmModule.forFeature([MemoryGameEntity])],
  providers: [MemoryGameRepository],
  exports: [MemoryGameRepository],
})
export class MemoryGameModule {}
