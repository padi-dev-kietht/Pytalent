import { MigrationInterface, QueryRunner, Table } from 'typeorm';

export class createAssessmentsTable1722501299267 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'assessments',
        columns: [
          {
            name: 'id',
            type: 'integer',
            isPrimary: true,
            isGenerated: true,
            generationStrategy: 'increment',
          },
          {
            name: 'name',
            type: 'varchar(255)',
          },
          {
            name: 'description',
            type: 'longtext',
          },
          {
            name: 'start_date',
            type: 'datetime',
          },
          {
            name: 'end_date',
            type: 'datetime',
          },
          {
            name: 'created_by',
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
    await queryRunner.dropTable('assessments');
  }
}
