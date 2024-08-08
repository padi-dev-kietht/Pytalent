import { Injectable } from '@nestjs/common';
import { GamesEntity } from '../entities';
import { DataSource, Repository } from 'typeorm';

@Injectable()
export class GamesRepository extends Repository<GamesEntity> {
  constructor(private dataSource: DataSource) {
    super(GamesEntity, dataSource.createEntityManager());
  }

  async findAllGames(): Promise<any> {
    return await this.find();
  }
}
