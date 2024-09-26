import { Connection } from 'typeorm';
import { Factory, Seeder } from 'typeorm-seeding';

export default class CreateHrGames implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    await connection
      .createQueryBuilder()
      .insert()
      .into('hr_games')
      .values([
        {
          game_id: 1,
          user_id: 2,
        },
        {
          game_id: 2,
          user_id: 2,
        },
      ])
      .execute();
  }
}
