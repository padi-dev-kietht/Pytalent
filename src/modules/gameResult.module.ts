import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { GameResultEntity } from '../entities';
import { GameResultRepository } from '../repositories/gameResult.repository';

@Module({
  imports: [TypeOrmModule.forFeature([GameResultEntity])],
  providers: [GameResultRepository],
  exports: [GameResultRepository],
})
export class GameResultModule {}
