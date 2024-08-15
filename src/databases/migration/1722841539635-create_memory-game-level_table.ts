import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class createMemoryGameTable1722841539635 implements MigrationInterface {
  name = 'createMemoryGameTable1722841539635';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'memory_game',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'level',
            type: 'integer',
          },
          {
            name: 'number_of_patterns',
            type: 'integer',
          },
          {
            name: 'display_time',
            type: 'integer',
          },
          {
            name: 'input_time',
            type: 'integer',
          },
          {
            name: 'patterns',
            type: 'array',
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
    await queryRunner.dropTable('memory_game');
  }
}
