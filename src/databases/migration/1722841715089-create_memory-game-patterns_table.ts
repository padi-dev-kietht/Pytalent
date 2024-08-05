import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class createMemoryGamePatternsTable1722841715089
  implements MigrationInterface
{
  name = 'createMemoryGamePatternsTable1722841715089';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'memory_game_pattern',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'memory_game_level_id',
            type: 'integer',
          },
          {
            name: 'pattern',
            type: 'varchar',
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
    await queryRunner.dropTable('memory_game_patterns');
  }
}
