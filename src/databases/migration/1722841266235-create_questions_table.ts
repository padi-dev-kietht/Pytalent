import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class createQuestionsTable1722841266235 implements MigrationInterface {
  name = 'createQuestionsTable1722841266235';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'questions',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'statement_one',
            type: 'varchar',
          },
          {
            name: 'statement_two',
            type: 'varchar',
          },
          {
            name: 'conclusion',
            type: 'varchar',
          },
          {
            name: 'is_conclusion_correct',
            type: 'boolean',
          },
          {
            name: 'created_at',
            type: 'datetime',
          },
          {
            name: 'updated_at',
            type: 'datetime',
            isNullable: true,
          },
        ],
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('questions');
  }
}
