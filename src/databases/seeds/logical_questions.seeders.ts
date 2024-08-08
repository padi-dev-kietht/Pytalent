import { Factory, Seeder } from 'typeorm-seeding';
import { questions } from '../../factories/questions.data';
import { Connection } from 'typeorm';
import { LogicalQuestionsEntity } from '../../entities';

export default class CreateLogicalQuestions implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    const logicalQuestions = questions;
    await connection
      .createQueryBuilder()
      .insert()
      .into(LogicalQuestionsEntity)
      .values(logicalQuestions)
      .execute();
  }
}
