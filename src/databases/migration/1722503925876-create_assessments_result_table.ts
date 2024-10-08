import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class createAssessmentsResultTable1722503925876
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'assessments_result',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'score',
            type: 'integer',
          },
          {
            name: 'assessment_id',
            type: 'integer',
          },
          {
            name: 'game_id',
            type: 'integer',
          },
          {
            name: 'completed_at',
            type: 'datetime',
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

    await queryRunner.createForeignKeys('assessments_result', [
      new TableForeignKey({
        columnNames: ['assessment_id'],
        referencedTableName: 'assessments',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),

      new TableForeignKey({
        columnNames: ['game_id'],
        referencedTableName: 'games',
        referencedColumnNames: ['id'],
        onDelete: 'CASCADE',
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('assessments_result');
  }
}
