import { Connection } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';
import { GamesEntity } from '../../entities';
import { GameTypeEnum } from '../../common/enum/game-type.enum';

export default class CreateGames implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    const games = [
      {
        id: 1,
        game_type: GameTypeEnum.LOGICAL,
        description:
          '3 entities and their relationships are shown in 2 statement, choose the conclusion that is inferred from the 2 statements',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      {
        id: 2,
        game_type: GameTypeEnum.MEMORY,
        description:
          'Each question appears a series of data, candidates have to input the same data in a required time (depending on the number of data). Skip option is not allowed, score based on level of memory',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    ];
    await connection
      .createQueryBuilder()
      .insert()
      .into(GamesEntity)
      .values(games)
      .execute();
  }
}
