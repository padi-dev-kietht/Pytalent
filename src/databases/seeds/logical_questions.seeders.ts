import { Factory, Seeder } from 'typeorm-seeding';
import { questions, twentyQuestionsData } from '../../factories/questions.data';
import { Connection } from 'typeorm';
import { LogicalQuestionsEntity } from '../../entities';

export default class CreateLogicalQuestions implements Seeder {
  public async run(factory: Factory, connection: Connection): Promise<any> {
    const logicalQuestions = questions;
    const twentyQuestions = twentyQuestionsData;
    await connection
      .createQueryBuilder()
      .insert()
      .into(LogicalQuestionsEntity)
      .values(logicalQuestions)
      .execute();

    await connection
      .createQueryBuilder()
      .insert()
      .into('game_questions')
      .values(twentyQuestions)
      .execute();
  }
}
