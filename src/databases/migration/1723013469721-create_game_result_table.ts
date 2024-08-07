import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class createGameResultTable1723013469721 implements MigrationInterface {
  name = 'createGameResultTable1723013469721';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'game_result',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'game_id',
            type: 'integer',
          },
          {
            name: 'candidate_id',
            type: 'integer',
          },
          {
            name: 'assessment_id',
            type: 'integer',
          },
          {
            name: 'score',
            type: 'integer',
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
    await queryRunner.dropTable('game_result');
  }
}
