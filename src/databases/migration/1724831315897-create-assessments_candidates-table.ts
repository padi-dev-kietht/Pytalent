import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class createAssessmentsCandidatesTable1724831315897
  implements MigrationInterface
{
  name = 'createAssessmentsCandidatesTable1724831315897';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'assessments_candidates',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'assessment_id',
            type: 'integer',
          },
          {
            name: 'candidate_id',
            type: 'integer',
          },
          {
            name: 'created_at',
            type: 'datetime',
          },
          {
            name: 'updated_at',
            type: 'datetime',
          },
        ],
      }),
    );
    await queryRunner.createForeignKeys('assessments_candidates', [
      new TableForeignKey({
        columnNames: ['assessment_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'assessments',
        onDelete: 'CASCADE',
      }),
      new TableForeignKey({
        columnNames: ['candidate_id'],
        referencedColumnNames: ['id'],
        referencedTableName: 'users',
        onDelete: 'CASCADE',
      }),
    ]);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropTable('assessments_candidates');
  }
}
